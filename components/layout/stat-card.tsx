import type { ReactNode } from "react";
import { cn } from "cn";
import { Card } from "@/components/ui/card";

/** KPI tile: label, big value, optional hint/footer. Same look on every page. */
export function StatCard({
  label,
  value,
  hint,
  children,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("gap-1 px-4 py-4", className)}>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {children ? <div className="mt-2 text-sm">{children}</div> : null}
    </Card>
  );
}
