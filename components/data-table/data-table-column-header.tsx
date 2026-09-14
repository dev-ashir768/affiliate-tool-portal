"use client";

import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import type { DataTableFeatures } from "@/components/data-table/types";

export type DataTableColumnHeaderProps<
  TData extends Record<string, unknown>,
  TValue = unknown,
> = {
  column: Column<DataTableFeatures, TData, TValue>;
  title: string;
  enableColumnOrdering?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  className?: string;
};

function cycleSorting<TData extends Record<string, unknown>, TValue>(
  column: Column<DataTableFeatures, TData, TValue>,
) {
  const sorted = column.getIsSorted();
  if (sorted === false) column.toggleSorting(false);
  else if (sorted === "asc") column.toggleSorting(true);
  else column.clearSorting();
}

export function DataTableColumnHeader<
  TData extends Record<string, unknown>,
  TValue = unknown,
>({
  column,
  title,
  enableColumnOrdering = false,
  dragHandleProps,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const sorted = column.getIsSorted();
  const ariaSort =
    sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none";
  const SortIcon =
    sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;
  const canSort = column.getCanSort();

  return (
    <div className={cn("flex min-w-0 items-center gap-1", className)}>
      {enableColumnOrdering ? (
        <span
          className="inline-flex size-6 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
          aria-label="Reorder column"
          {...dragHandleProps}
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
        >
          <GripVertical className="size-3.5" />
        </span>
      ) : null}

      {canSort ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-1.5 h-7 gap-1 px-1.5 font-medium"
          aria-sort={ariaSort}
          onClick={() => cycleSorting(column)}
        >
          <span className="truncate">{title}</span>
          <SortIcon className="size-3.5 text-muted-foreground" />
        </Button>
      ) : (
        <span className="truncate px-1.5 text-sm font-medium">{title}</span>
      )}
    </div>
  );
}
