"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableExportFormat } from "@/components/data-table/types";

export type DataTableExportProps = {
  onExport: (format: DataTableExportFormat) => Promise<void>;
  isExporting?: boolean;
  disabled?: boolean;
};

export function DataTableExport({
  onExport,
  isExporting = false,
  disabled = false,
}: DataTableExportProps) {
  const [localExporting, setLocalExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const exporting = isExporting || localExporting;
  const triggerDisabled = disabled || exporting;

  async function handleExport(format: DataTableExportFormat) {
    setError(null);
    setLocalExporting(true);
    try {
      await onExport(format);
    } catch {
      setError("Export failed. Please try again.");
    } finally {
      setLocalExporting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={triggerDisabled}
          render={
            <Button type="button" variant="outline" size="sm" />
          }
        >
          {exporting ? (
            <LoaderCircle className="animate-spin" aria-hidden />
          ) : null}
          Export
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem
            disabled={exporting}
            onClick={() => void handleExport("csv")}
          >
            CSV
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={exporting}
            onClick={() => void handleExport("xlsx")}
          >
            Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
