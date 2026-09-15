### Task 5: Zustand preferences store

**Files:**
- Create: `components/data-table/store/data-table-preferences-store.ts`
- Create: `components/data-table/hooks/use-data-table-preferences.ts`

**Interfaces:**
- Consumes: TanStack visibility/order/sizing state shapes
- Produces: `useDataTablePreferences(tableId)` â†’ `{ columnVisibility, columnOrder, columnSizing, setColumnVisibility, setColumnOrder, setColumnSizing }`

- [ ] **Step 1: Store**

```ts
// components/data-table/store/data-table-preferences-store.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ColumnOrderState,
  ColumnSizingState,
  VisibilityState,
} from "@tanstack/react-table";

export type TablePreferences = {
  columnVisibility: VisibilityState;
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
    { name: "datatable-preferences" },
  ),
);
```

- [ ] **Step 2: Hook**

```ts
// components/data-table/hooks/use-data-table-preferences.ts
"use client";

import { useCallback } from "react";
import type {
  ColumnOrderState,
  ColumnSizingState,
  OnChangeFn,
  VisibilityState,
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

  const setColumnVisibility: OnChangeFn<VisibilityState> = useCallback(
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
```

- [ ] **Step 3: Commit**

```bash
git add components/data-table/store components/data-table/hooks
git commit -m "feat: add Zustand DataTable preferences persistence"
```

---

