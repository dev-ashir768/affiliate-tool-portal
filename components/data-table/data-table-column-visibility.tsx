"use client";

import type { Column, Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableFeatures } from "@/components/data-table/types";

export type DataTableColumnVisibilityProps<
  TData extends Record<string, unknown>,
> = {
  table: Table<DataTableFeatures, TData>;
  disabled?: boolean;
};

function getColumnLabel<TData extends Record<string, unknown>>(
  column: Column<DataTableFeatures, TData, unknown>,
): string {
  const header = column.columnDef.header;
  return typeof header === "string" && header.length > 0 ? header : column.id;
}

export function DataTableColumnVisibility<
  TData extends Record<string, unknown>,
>({ table, disabled }: DataTableColumnVisibilityProps<TData>) {
  const hideableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide());

  if (hideableColumns.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        render={<Button type="button" variant="outline" size="sm" />}
      >
        Columns
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        {hideableColumns.map((column) => (
          <DropdownMenuItem
            key={column.id}
            closeOnClick={false}
            onClick={() => column.toggleVisibility()}
          >
            <Checkbox
              checked={column.getIsVisible()}
              className="pointer-events-none"
              tabIndex={-1}
              aria-hidden
            />
            <span className="truncate">{getColumnLabel(column)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
