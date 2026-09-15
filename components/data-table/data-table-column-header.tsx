"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import type { DataTableFeatures } from "@/components/data-table/types";

export type DataTableColumnHeaderProps<
  TData extends object,
  TValue = unknown,
> = {
  column: Column<DataTableFeatures, TData, TValue>;
  title: string;
  className?: string;
};

function cycleSorting<TData extends object, TValue>(
  column: Column<DataTableFeatures, TData, TValue>,
) {
  const sorted = column.getIsSorted();
  if (sorted === false) column.toggleSorting(false);
  else if (sorted === "asc") column.toggleSorting(true);
  else column.clearSorting();
}

export function DataTableColumnHeader<
  TData extends object,
  TValue = unknown,
>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const sorted = column.getIsSorted();
  const SortIcon =
    sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;
  const canSort = column.getCanSort();

  return (
    <div className={cn("flex min-w-0 items-center gap-1", className)}>
      {canSort ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-1 font-semibold text-foreground hover:bg-transparent"
          onClick={() => cycleSorting(column)}
        >
          <span className="truncate">{title}</span>
          <SortIcon className="size-3.5 shrink-0 text-muted-foreground/70" />
        </Button>
      ) : (
        <span className="truncate px-1 text-sm font-semibold">{title}</span>
      )}
    </div>
  );
}
