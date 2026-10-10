"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ImpersonationBanner({
  email,
  name,
}: {
  email: string;
  name: string;
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
            : "/backoffice/organizations",
        );
      } catch {
        toast.error("Could not exit impersonation");
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-100 px-4 py-2 text-sm text-amber-950">
      <p>
        Viewing as <span className="font-medium">{name}</span> ({email}). Actions
        run as this user; start is audited.
      </p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={exit}
      >
        {pending ? "Exiting…" : "Exit to backoffice"}
      </Button>
    </div>
  );
}
