"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, MonitorIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type InputEvent =
  | { type: "mouse"; action: "down" | "up" | "move"; x: number; y: number; button?: "left" | "right" }
  | { type: "wheel"; x: number; y: number; deltaX: number; deltaY: number }
  | { type: "text"; text: string }
  | { type: "key"; key: string };

const SPECIAL_KEYS = new Set([
  "Enter",
  "Backspace",
  "Tab",
  "Escape",
  "Delete",
  "ArrowLeft",
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "Home",
  "End",
]);

async function api<T>(url: string, init?: RequestInit): Promise<T | undefined> {
  const res = await fetch(url, { credentials: "include", cache: "no-store", ...init });
  if (res.status === 204) return undefined;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message ?? "Request failed");
  return data as T;
}

/**
 * Live view of a server-side browser where the merchant signs in to TikTok as
 * their bot. Screens are polled; clicks, drags, scrolls and typing are relayed.
 */
export function BotActivationPanel({
  shopId,
  onActivated,
}: {
  shopId: string;
  onActivated: () => void;
}) {
  const qc = useQueryClient();
  const base = `/api/shops/${encodeURIComponent(shopId)}/bot-activation`;
  const [phase, setPhase] = useState<"idle" | "starting" | "live" | "saving">("idle");
  const [image, setImage] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 1280, height: 800 });
  const [error, setError] = useState<string | null>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const queue = useRef<InputEvent[]>([]);
  const seq = useRef(0);
  const dragging = useRef(false);
  const lastHover = useRef(0);
  const live = phase === "live" || phase === "saving";

  const stop = useCallback(() => {
    void fetch(base, { method: "DELETE", credentials: "include", keepalive: true }).catch(
      () => undefined,
    );
  }, [base]);

  // Poll screen frames while live.
  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = async () => {
      try {
        const frame = await api<{ seq: number; image: string }>(
          `${base}/frame?after=${seq.current}`,
        );
        if (!cancelled && frame) {
          seq.current = frame.seq;
          setImage(frame.image);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Sign-in window closed");
          setPhase("idle");
          return;
        }
      }
      if (!cancelled) timer = setTimeout(tick, 250);
    };
    void tick();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [live, base]);

  // Flush queued input every 60ms so drags stay smooth without a request per pixel.
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      if (queue.current.length === 0) return;
      const events = queue.current.splice(0, 200);
      void api(`${base}/input`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
      }).catch(() => undefined);
    }, 60);
    return () => clearInterval(id);
  }, [live, base]);

  // Close the server browser if the dialog unmounts mid-session.
  useEffect(() => {
    if (!live) return;
    return stop;
  }, [live, stop]);

  async function start() {
    setError(null);
    setPhase("starting");
    try {
      const res = await api<{ width: number; height: number }>(base, { method: "POST" });
      if (res) setSize({ width: res.width, height: res.height });
      seq.current = 0;
      setImage(null);
      setPhase("live");
      setTimeout(() => screenRef.current?.focus(), 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start sign-in");
      setPhase("idle");
    }
  }

  async function save(force = false) {
    setPhase("saving");
    try {
      const res = await api<{ activated: boolean; looksSignedIn: boolean }>(`${base}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force }),
      });
      if (res && !res.activated) {
        setPhase("live");
        if (
          window.confirm(
            "The browser still looks like a sign-in page. Save it anyway? Only do this if you're sure the bot is signed in.",
          )
        ) {
          await save(true);
        }
        return;
      }
      toast.success("Bot activated");
      setPhase("idle");
      setImage(null);
      void qc.invalidateQueries({ queryKey: ["shops", "list"] });
      onActivated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save sign-in");
      setPhase("live");
    }
  }

  function cancel() {
    stop();
    setPhase("idle");
    setImage(null);
  }

  function point(e: React.MouseEvent | React.WheelEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * size.width,
      y: ((e.clientY - rect.top) / rect.height) * size.height,
    };
  }

  function push(ev: InputEvent) {
    queue.current.push(ev);
  }

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    screenRef.current?.focus();
    dragging.current = true;
    push({ type: "mouse", action: "down", ...point(e), button: e.button === 2 ? "right" : "left" });
  }
  function onMouseUp(e: React.MouseEvent) {
    dragging.current = false;
    push({ type: "mouse", action: "up", ...point(e), button: e.button === 2 ? "right" : "left" });
  }
  function onMouseMove(e: React.MouseEvent) {
    if (dragging.current) {
      push({ type: "mouse", action: "move", ...point(e), button: "left" });
      return;
    }
    const now = Date.now();
    if (now - lastHover.current < 120) return;
    lastHover.current = now;
    push({ type: "mouse", action: "move", ...point(e) });
  }
  function onWheel(e: React.WheelEvent) {
    push({ type: "wheel", ...point(e), deltaX: e.deltaX, deltaY: e.deltaY });
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") return; // handled by onPaste
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (SPECIAL_KEYS.has(e.key)) {
      e.preventDefault();
      push({ type: "key", key: e.key });
    } else if (e.key.length === 1) {
      e.preventDefault();
      push({ type: "text", text: e.key });
    }
  }
  function onPaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text");
    if (text) {
      e.preventDefault();
      push({ type: "text", text: text.slice(0, 500) });
    }
  }

  if (!live) {
    return (
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          className="w-fit"
          disabled={phase === "starting"}
          onClick={() => void start()}
        >
          {phase === "starting" ? (
            <Loader2Icon data-icon="inline-start" className="animate-spin" />
          ) : (
            <MonitorIcon data-icon="inline-start" />
          )}
          {phase === "starting" ? "Opening TikTok…" : "Sign in as the bot"}
        </Button>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={screenRef}
        tabIndex={0}
        role="application"
        aria-label="TikTok sign-in window. Click to interact, type to enter text."
        className="relative w-full cursor-default overflow-hidden rounded-lg border border-border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{ aspectRatio: `${size.width} / ${size.height}` }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseLeave={() => (dragging.current = false)}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onContextMenu={(e) => e.preventDefault()}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" draggable={false} className="pointer-events-none h-full w-full select-none" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            <Loader2Icon className="mr-2 size-4 animate-spin" /> Loading TikTok…
          </div>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground">
        Click inside the window, then type. Paste works with Ctrl/⌘+V. Solve any puzzle yourself.
      </p>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button type="button" disabled={phase === "saving"} onClick={() => void save()}>
          {phase === "saving" ? "Saving…" : "I'm signed in — save"}
        </Button>
        <Button type="button" variant="outline" disabled={phase === "saving"} onClick={cancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
