"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ColumnOrderState,
  ColumnSizingState,
  ColumnVisibilityState,
} from "@tanstack/react-table";

export type TablePreferences = {
  columnVisibility: ColumnVisibilityState;
  columnOrder: ColumnOrderState;
  columnSizing: ColumnSizingState;
};

type PreferencesState = {
  byTable: Record<string, TablePreferences>;
  setPreferences: (
    tableId: string,
    patch: Partial<TablePreferences>,
  ) => void;
};

const emptyPrefs = (): TablePreferences => ({
  columnVisibility: {},
  columnOrder: [],
  columnSizing: {},
});

export const useDataTablePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      byTable: {},
      setPreferences: (tableId, patch) =>
        set((state) => ({
          byTable: {
            ...state.byTable,
            [tableId]: {
              ...emptyPrefs(),
              ...state.byTable[tableId],
              ...patch,
            },
          },
        })),
    }),
    { name: "datatable-preferences", version: 1 },
  ),
);
