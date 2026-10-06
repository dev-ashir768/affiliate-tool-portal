import type { ReactNode } from "react";
import { cn } from "cn";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Standard content block for portal pages: titled card with optional
 * description, header actions and a footer (e.g. the form's submit button).
 */
export function SectionCard({
  title,
  description,
  actions,
  footer,
  children,
  className,
  contentClassName,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const hasHeader = title != null || description != null || actions != null;
  return (
    <Card className={cn("gap-5", className)}>
      {hasHeader ? (
        <CardHeader className="border-b pb-4">
          {title != null ? (
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
          ) : null}
          {description != null ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
          {actions != null ? <CardAction>{actions}</CardAction> : null}
        </CardHeader>
      ) : null}
      {children != null ? (
        <CardContent className={cn("flex-1", contentClassName)}>
          {children}
        </CardContent>
      ) : null}
      {footer != null ? (
        <CardFooter className="justify-end gap-2">{footer}</CardFooter>
      ) : null}
    </Card>
  );
}

/** Responsive grid for labelled form fields inside a SectionCard. */
export function FormGrid({
  children,
  columns = 2,
  className,
}: {
  children: ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
