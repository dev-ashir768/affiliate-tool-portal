"use client";

import { useCallback } from "react";
import type {
  ColumnOrderState,
  ColumnSizingState,
  ColumnVisibilityState,
  OnChangeFn,
} from "@tanstack/react-table";
import {
  useDataTablePreferencesStore,
  type TablePreferences,
} from "../store/data-table-preferences-store";

const empty: TablePreferences = {
  columnVisibility: {},
  columnOrder: [],
  columnSizing: {},
};

export function useDataTablePreferences(tableId: string) {
  const prefs = useDataTablePreferencesStore(
    (s) => s.byTable[tableId] ?? empty,
  );
  const setPreferences = useDataTablePreferencesStore((s) => s.setPreferences);

  const setColumnVisibility: OnChangeFn<ColumnVisibilityState> = useCallback(
    (updater) => {
      const prev = prefs.columnVisibility;
      const next = typeof updater === "function" ? updater(prev) : updater;
      setPreferences(tableId, { columnVisibility: next });
    },
    [prefs.columnVisibility, setPreferences, tableId],
  );

  const setColumnOrder: OnChangeFn<ColumnOrderState> = useCallback(
    (updater) => {
      const prev = prefs.columnOrder;
      const next = typeof updater === "function" ? updater(prev) : updater;
      setPreferences(tableId, { columnOrder: next });
    },
    [prefs.columnOrder, setPreferences, tableId],
  );

  const setColumnSizing: OnChangeFn<ColumnSizingState> = useCallback(
    (updater) => {
      const prev = prefs.columnSizing;
      const next = typeof updater === "function" ? updater(prev) : updater;
      setPreferences(tableId, { columnSizing: next });
    },
    [prefs.columnSizing, setPreferences, tableId],
  );

  return {
    ...prefs,
    setColumnVisibility,
    setColumnOrder,
    setColumnSizing,
  };
}
