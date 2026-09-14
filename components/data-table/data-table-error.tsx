"use client";

import { Button } from "@/components/ui/button";

type Props = { onRetry?: () => void };

export function DataTableError({ onRetry }: Props) {
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
