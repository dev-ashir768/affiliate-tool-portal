"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { isChunkLoadError, reloadForNewBuild } from "@/lib/ui/chunk-error";

/**
 * In-shell error screen: keeps the sidebar/topbar, shows what failed (message
 * + digest to quote in a bug report) and recovers from stale deploy chunks.
 */
export function RouteError({
  error,
  reset,
  scope,
  homeHref,
  homeLabel,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  scope: string;
  homeHref: string;
  homeLabel: string;
}) {
  const router = useRouter();
  const staleBuild = isChunkLoadError(error);

  useEffect(() => {
    console.error(`[${scope}]`, error);
    if (isChunkLoadError(error)) reloadForNewBuild();
  }, [error, scope]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-xl font-semibold tracking-tight">
        Something went wrong
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {staleBuild
          ? "A new version was deployed — reloading to pick it up…"
          : "This screen hit an unexpected error. Try again, or reload the page."}
      </p>
      <pre className="max-w-xl overflow-x-auto rounded-md bg-card px-3 py-2 text-left font-mono text-xs whitespace-pre-wrap text-muted-foreground">
        {error.message || "Unknown error"}
        {error.digest ? `\nRef: ${error.digest}` : ""}
      </pre>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(homeHref)}
        >
          {homeLabel}
        </Button>
      </div>
    </div>
  );
}
