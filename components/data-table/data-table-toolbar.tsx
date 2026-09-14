"use client";

import { useEffect, useState } from "react";
import type { Table } from "@tanstack/react-table";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableColumnVisibility } from "@/components/data-table/data-table-column-visibility";
import { DataTableExport } from "@/components/data-table/data-table-export";
import type {
  DataTableExportFormat,
  DataTableFeatures,
} from "@/components/data-table/types";

const SEARCH_DEBOUNCE_MS = 400;

export type DataTableToolbarProps<TData extends Record<string, unknown>> = {
  table: Table<DataTableFeatures, TData>;
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh?: () => void;
  onExport?: (format: DataTableExportFormat) => Promise<void>;
  isFetching?: boolean;
  isExporting?: boolean;
  disabled?: boolean;
};

export function DataTableToolbar<TData extends Record<string, unknown>>({
  table,
  search,
  onSearchChange,
  onRefresh,
  onExport,
  isFetching = false,
  isExporting = false,
  disabled = false,
}: DataTableToolbarProps<TData>) {
  const [inputValue, setInputValue] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);

  if (search !== prevSearch) {
    setPrevSearch(search);
    setInputValue(search);
  }

  useEffect(() => {
    if (inputValue === search) return;
    const timeoutId = window.setTimeout(() => {
      onSearchChange(inputValue);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [inputValue, search, onSearchChange]);

  return (
    <div className="flex flex-wrap items-start gap-2">
      <Input
        type="search"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Search..."
        aria-label="Search"
        disabled={disabled}
        className="h-8 min-w-40 flex-1"
      />
      <div className="ml-auto flex flex-wrap items-center gap-2">
        <DataTableColumnVisibility table={table} disabled={disabled} />
        {onRefresh ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Refresh"
            disabled={disabled || isFetching}
            onClick={onRefresh}
          >
            <RefreshCw className={isFetching ? "animate-spin" : undefined} />
          </Button>
        ) : null}
        {onExport ? (
          <DataTableExport
            onExport={onExport}
            isExporting={isExporting}
            disabled={disabled}
          />
        ) : null}
      </div>
    </div>
  );
}
