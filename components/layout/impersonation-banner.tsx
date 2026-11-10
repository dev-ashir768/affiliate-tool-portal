"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ImpersonationBanner({
  email,
  name,
  mode = "impersonate",
}: {
  email: string;
  name: string;
  mode?: "impersonate" | "break_glass";
}) {
  const [pending, startTransition] = useTransition();

  function exit() {
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/exit-impersonation", {
          method: "POST",
          credentials: "include",
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(payload?.error?.message ?? "Could not exit impersonation");
          return;
        }
        window.location.replace(
          typeof payload.redirectTo === "string"
            ? payload.redirectTo
            : mode === "break_glass"
              ? "/login"
              : "/backoffice/organizations",
        );
      } catch {
        toast.error("Could not exit impersonation");
      }
    });
  }

  const label = mode === "break_glass" ? "Break-glass as" : "Viewing as";
  const exitLabel =
    mode === "break_glass" ? "Exit session" : "Exit to backoffice";

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-100 px-4 py-2 text-sm text-amber-950">
      <p>
        {label} <span className="font-medium">{name}</span> ({email}). Actions
        run as this user; start is audited.
      </p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={exit}
      >
        {pending ? "Exiting…" : exitLabel}
      </Button>
    </div>
  );
}
