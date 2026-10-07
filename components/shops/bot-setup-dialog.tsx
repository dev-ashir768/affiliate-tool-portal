"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, ExternalLinkIcon, InboxIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useShopBotInbox } from "@/hooks/use-shops";
import { BotActivationPanel } from "@/components/shops/bot-activation-panel";
import type { Shop } from "@/types/shops";
import { cn } from "cn";

const SELLER_CENTER: Record<Shop["region"], string> = {
  US: "https://seller-us.tiktok.com/",
  UK: "https://seller-uk.tiktok.com/",
};

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      toast.success(`${label} copied`);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error(`Could not copy ${label.toLowerCase()}`);
    }
  }
  return { copied, copy };
}

function Step({
  n,
  title,
  done,
  children,
}: {
  n: number;
  title: string;
  done?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span
        className={cn(
          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          done ? "bg-emerald-500 text-white" : "bg-muted text-foreground",
        )}
      >
        {done ? <CheckIcon className="size-3.5" /> : n}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-sm font-medium">{title}</p>
        {children}
      </div>
    </li>
  );
}

function BotInbox({ shopId }: { shopId: string }) {
  const inbox = useShopBotInbox(shopId);
  const { copied, copy } = useCopy();
  const messages = inbox.data?.messages ?? [];

  return (
    <div className="rounded-lg border border-border">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="flex items-center gap-1.5 text-xs font-medium">
          <InboxIcon className="size-3.5" />
          Bot inbox
        </span>
        <span className="text-[11px] text-muted-foreground">
          {inbox.isFetching ? "Checking…" : "Refreshes every 10s"}
        </span>
      </div>
      {inbox.isLoading ? (
        <div className="p-3">
          <Skeleton className="h-10 w-full" />
        </div>
      ) : inbox.isError ? (
        <p className="p-3 text-xs text-destructive">
          {inbox.error instanceof Error ? inbox.error.message : "Couldn't load inbox"}
        </p>
      ) : messages.length === 0 ? (
        <p className="p-3 text-xs text-muted-foreground">
          No emails yet. Codes TikTok sends to the bot email show up here.
        </p>
      ) : (
        <ul className="max-h-56 divide-y overflow-y-auto">
          {messages.map((m) => (
            <li
              key={`${m.receivedAt}-${m.subject}`}
              className="flex items-center justify-between gap-3 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">{m.subject || "(no subject)"}</p>
                <p className="text-[11px] text-muted-foreground">
                  {m.from} · {new Date(m.receivedAt).toLocaleTimeString()}
                </p>
              </div>
              {m.code ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="shrink-0 font-mono tracking-widest"
                  onClick={() => void copy(m.code!, "Code")}
                >
                  {copied === m.code ? <CheckIcon data-icon="inline-start" /> : null}
                  {m.code}
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function BotSetupDialog({
  shop,
  open,
  onOpenChange,
}: {
  shop: Shop | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { copied, copy } = useCopy();
  if (!shop?.botEmail) return null;
  const email = shop.botEmail;
  const activated = Boolean(shop.botActivatedAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Set up your bot</DialogTitle>
          <DialogDescription>
            The bot is a TikTok account that works in your shop for you. You only do this once.
          </DialogDescription>
        </DialogHeader>

        <ol className="flex flex-col gap-5">
          <Step n={1} title="Your bot email">
            <div className="flex gap-2">
              <p className="min-w-0 flex-1 rounded-lg border border-border bg-muted/40 px-3 py-2 font-mono text-sm break-all">
                {email}
              </p>
              <Button type="button" variant="outline" onClick={() => void copy(email, "Bot email")}>
                {copied === email ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
                Copy
              </Button>
            </div>
          </Step>

          <Step n={2} title="Create a TikTok account with this email" done={activated}>
            <p className="text-xs text-muted-foreground">
              Sign up in a private/incognito window so it doesn&apos;t mix with your own
              TikTok login. Use the bot email above and choose any strong password.
              Verification codes arrive here:
            </p>
            <a
              href={SELLER_CENTER[shop.region]}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Open TikTok Seller Center ({shop.region})
              <ExternalLinkIcon className="size-3" />
            </a>
            <BotInbox shopId={shop.id} />
          </Step>

          <Step n={3} title="Activate the bot" done={activated}>
            <p className="text-xs text-muted-foreground">
              {activated
                ? `Activated ${new Date(shop.botActivatedAt!).toLocaleString()}. Sign in again only if verify says the sign-in expired.`
                : "Sign in to TikTok Seller Center as the bot, right here. Use the bot email and the password you chose. Codes appear in the bot inbox above."}
            </p>
            <BotActivationPanel shopId={shop.id} onActivated={() => undefined} />
          </Step>

          <Step n={4} title="Invite the bot to your shop, then Verify">
            <p className="text-xs text-muted-foreground">
              In your own Seller Center: Account → User management → add the bot email
              as a member with affiliate access. Then click <span className="font-medium text-foreground">Verify</span>{" "}
              on this shop.
            </p>
          </Step>
        </ol>

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
