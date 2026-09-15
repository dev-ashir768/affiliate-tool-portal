"use client";

import { useEffect, useRef, useState } from "react";
import type { Table } from "@tanstack/react-table";
import { ListFilter, RefreshCw, Search, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableColumnVisibility } from "@/components/data-table/data-table-column-visibility";
import { DataTableExport } from "@/components/data-table/data-table-export";
import type {
  DataTableExportFormat,
  DataTableFeatures,
} from "@/components/data-table/types";

const SEARCH_DEBOUNCE_MS = 400;

export type DataTableToolbarProps<TData extends object> = {
  table: Table<DataTableFeatures, TData>;
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh?: () => void;
  onExport?: (format: DataTableExportFormat) => Promise<void>;
  onFiltersClick?: () => void;
  isFetching?: boolean;
  isExporting?: boolean;
  disabled?: boolean;
};

export function DataTableToolbar<TData extends object>({
  table,
  search,
  onSearchChange,
  onRefresh,
  onExport,
  onFiltersClick,
  isFetching = false,
  isExporting = false,
  disabled = false,
}: DataTableToolbarProps<TData>) {
  const [inputValue, setInputValue] = useState(search);
  const [searchOpen, setSearchOpen] = useState(() => Boolean(search.trim()));
  const [showSearchButton, setShowSearchButton] = useState(
    () => !Boolean(search.trim()),
  );
  const searchRef = useRef(search);
  const onSearchChangeRef = useRef(onSearchChange);
  const searchFieldRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current != null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  useEffect(() => {
    setInputValue((current) =>
      current === searchRef.current ? search : current,
    );
    searchRef.current = search;
    if (search.trim()) {
      setSearchOpen(true);
      setShowSearchButton(false);
    }
  }, [search]);

  useEffect(() => {
    if (inputValue === search) return;
    const timeoutId = window.setTimeout(() => {
      onSearchChangeRef.current(inputValue);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [inputValue, search]);

  useEffect(() => {
    if (!searchOpen) return;
    const id = window.requestAnimationFrame(() => {
      searchFieldRef.current
        ?.querySelector<HTMLInputElement>("input")
        ?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [searchOpen]);

  function openSearch() {
    if (closeTimerRef.current != null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setShowSearchButton(false);
    setSearchOpen(true);
  }

  function closeSearch() {
    setInputValue("");
    onSearchChangeRef.current("");
    searchRef.current = "";
    setSearchOpen(false);
    if (closeTimerRef.current != null) {
      window.clearTimeout(closeTimerRef.current);
    }
    // Wait for L→R collapse, then show search icon again
    closeTimerRef.current = window.setTimeout(() => {
      setShowSearchButton(true);
      closeTimerRef.current = null;
    }, 300);
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Escape") return;
    if (inputValue) {
      setInputValue("");
      onSearchChangeRef.current("");
      searchRef.current = "";
      return;
    }
    closeSearch();
  }

  return (
    <TooltipProvider>
      <div className="flex w-full items-center justify-end gap-2 px-3">
        <div
          className={cn(
            "overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out",
            searchOpen
              ? "max-w-sm opacity-100 sm:max-w-md"
              : "max-w-0 opacity-0",
          )}
        >
          <div
            className="relative w-[min(100vw-8rem,28rem)] min-w-48"
            ref={searchFieldRef}
          >
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search..."
              aria-label="Search"
              disabled={disabled || !searchOpen}
              tabIndex={searchOpen ? 0 : -1}
              className="h-9 w-full bg-muted pr-9 pl-9 focus-visible:ring-0 focus-visible:border-border border-0"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close search"
              disabled={disabled || !searchOpen}
              onClick={closeSearch}
              tabIndex={searchOpen ? 0 : -1}
              className="absolute top-1/2 right-1 size-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex shrink-0 items-center">
          {showSearchButton ? (
            <Tooltip>
              <TooltipTrigger
                delay={200}
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Search"
                    disabled={disabled}
                    onClick={openSearch}
                    className="size-9"
                  />
                }
              >
                <Search className="size-4" />
              </TooltipTrigger>
              <TooltipContent side="bottom">Search</TooltipContent>
            </Tooltip>
          ) : null}

          <DataTableColumnVisibility table={table} disabled={disabled} />

          {onRefresh ? (
            <Tooltip>
              <TooltipTrigger
                delay={200}
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Refresh"
                    disabled={disabled || isFetching}
                    onClick={onRefresh}
                    className="size-9"
                  />
                }
              >
                <RefreshCw
                  className={isFetching ? "size-4 animate-spin" : "size-4"}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">Refresh</TooltipContent>
            </Tooltip>
          ) : null}

          {onExport ? (
            <DataTableExport
              onExport={onExport}
              isExporting={isExporting}
              disabled={disabled}
            />
          ) : null}

          {onFiltersClick ? (
            <Tooltip>
              <TooltipTrigger
                delay={200}
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Filters"
                    disabled={disabled}
                    onClick={onFiltersClick}
                    className="size-9"
                  />
                }
              >
                <ListFilter className="size-4" />
              </TooltipTrigger>
              <TooltipContent side="bottom">Filters</TooltipContent>
            </Tooltip>
          ) : (
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
                          aria-label="Filters"
                        />
                      }
                    />
                  }
                >
                  <ListFilter className="size-4" />
                </TooltipTrigger>
                <TooltipContent side="bottom">Filters</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-normal text-muted-foreground">
                  No filters available
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
