"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePatchPlatformProxy } from "@/hooks/use-platform";
import type { PlatformProxy } from "@/types/platform";

export function ProxyRowActions({ proxy }: { proxy: PlatformProxy }) {
  const patch = usePatchPlatformProxy();

  async function setStatus(status: PlatformProxy["status"]) {
    try {
      await patch.mutateAsync({ id: proxy.id, body: { status } });
      toast.success(`Proxy marked ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {proxy.status !== "DISABLED" ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={patch.isPending}
          onClick={() => void setStatus("DISABLED")}
        >
          Disable
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={patch.isPending}
          onClick={() => void setStatus("AVAILABLE")}
        >
          Enable
        </Button>
      )}
      {proxy.status !== "BANNED" ? (
        <Button
          type="button"
          size="sm"
          variant="destructive"
          disabled={patch.isPending}
          onClick={() => void setStatus("BANNED")}
        >
          Ban
        </Button>
      ) : null}
    </div>
  );
}
