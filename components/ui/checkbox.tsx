import * as React from "react";
import { cn } from "cn";

/** Native checkbox styled with theme tokens (keeps form semantics simple). */
function Checkbox({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        "size-4 shrink-0 cursor-pointer rounded border-input accent-primary disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

/** Checkbox + label row with consistent spacing. */
function CheckboxLabel({
  children,
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type"> & {
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2 text-sm text-foreground",
        className,
      )}
    >
      <Checkbox {...props} />
      <span className="min-w-0">{children}</span>
    </label>
  );
}

export { Checkbox, CheckboxLabel };
