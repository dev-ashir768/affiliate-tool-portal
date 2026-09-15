"use client";

import type { Column, Table } from "@tanstack/react-table";
import { Columns3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DataTableFeatures } from "@/components/data-table/types";

export type DataTableColumnVisibilityProps<TData extends object> = {
  table: Table<DataTableFeatures, TData>;
  disabled?: boolean;
};

function getColumnLabel<TData extends object>(
  column: Column<DataTableFeatures, TData, unknown>,
): string {
  const label = column.columnDef.meta?.label;
  if (typeof label === "string" && label.length > 0) return label;
  const header = column.columnDef.header;
  return typeof header === "string" && header.length > 0 ? header : column.id;
}

export function DataTableColumnVisibility<TData extends object>({
  table,
  disabled,
}: DataTableColumnVisibilityProps<TData>) {
  const hideableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide());

  if (hideableColumns.length === 0) return null;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          delay={200}
          render={
            <DropdownMenuTrigger
              disabled={disabled}
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  aria-label="Toggle columns"
                />
              }
            />
          }
        >
          <Columns3 className="size-4" />
        </TooltipTrigger>
        <TooltipContent side="bottom">Columns</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          {hideableColumns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(checked) => column.toggleVisibility(checked)}
            >
              <span className="truncate">{getColumnLabel(column)}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
