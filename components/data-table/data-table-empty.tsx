"use client";

import { Button } from "@/components/ui/button";

type Props = {
  search?: string;
  onClearSearch?: () => void;
};

export function DataTableEmpty({ search, onClearSearch }: Props) {
  const hasSearch = Boolean(search?.trim());
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-sm font-medium text-foreground">
        {hasSearch ? `No results found for "${search}"` : "No records found"}
      </p>
      {hasSearch && onClearSearch ? (
        <Button type="button" variant="outline" size="sm" onClick={onClearSearch}>
          Clear search
        </Button>
      ) : null}
    </div>
  );
}
