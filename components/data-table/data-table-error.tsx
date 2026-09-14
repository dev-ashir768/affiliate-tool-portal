"use client";

import { Button } from "@/components/ui/button";

type Props = { onRetry?: () => void; variant?: "full" | "inline" };

export function DataTableError({ onRetry, variant = "full" }: Props) {
  if (variant === "inline") {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2"
      >
        <p className="text-sm text-foreground">
          Unable to refresh data. Showing last loaded results.
        </p>
        {onRetry ? (
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-sm font-medium text-foreground">Something went wrong</p>
      <p className="text-sm text-muted-foreground">Unable to load data.</p>
      {onRetry ? (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      ) : null}
    </div>
  );
}
