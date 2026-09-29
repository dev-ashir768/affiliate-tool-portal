"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/data-table";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";
import { useClientDataTable } from "@/hooks/use-client-data-table";
import {
  useAdminNavigation,
  usePatchAdminNavItem,
} from "@/hooks/use-platform";
import type { AdminNavItem } from "@/types/platform";
import { AddNavigationItemDialog } from "@/components/backoffice/navigation/add-navigation-item-dialog";
import {
  createNavigationAdminColumns,
  type NavItemDraft,
} from "./navigation-admin-columns";

type Area = "dashboard" | "backoffice";

const AREA_OPTIONS: SelectOption[] = [
  { value: "backoffice", label: "Backoffice" },
  { value: "dashboard", label: "Dashboard" },
];

function NavigationSectionTable({
  sectionId,
  items,
  areaFilter,
  onAreaChange,
  showAreaFilter,
}: {
  sectionId: string;
  items: AdminNavItem[];
  areaFilter: Area;
  onAreaChange: (area: Area) => void;
  showAreaFilter: boolean;
}) {
  const patch = usePatchAdminNavItem();
  const [drafts, setDrafts] = useState<Record<string, NavItemDraft>>({});

  const draftFor = useCallback(
    (item: AdminNavItem): NavItemDraft =>
      drafts[item.id] ?? {
        label: item.label,
        href: item.href,
        sortOrder: item.sortOrder,
      },
    [drafts],
  );

  const onDraftChange = useCallback(
    (item: AdminNavItem, field: keyof NavItemDraft, value: string | number) => {
      setDrafts((prev) => {
        const base = prev[item.id] ?? {
          label: item.label,
          href: item.href,
          sortOrder: item.sortOrder,
        };
        return {
          ...prev,
          [item.id]: {
            ...base,
            [field]: value,
          },
        };
      });
    },
    [],
  );

  const onSave = useCallback(
    (item: AdminNavItem) => {
      const draft = draftFor(item);
      void patch
        .mutateAsync({
          id: item.id,
          body: {
            label: draft.label,
            href: draft.href,
            sortOrder: draft.sortOrder,
          },
        })
        .then(() => toast.success("Nav item updated"))
        .catch((err) =>
          toast.error(err instanceof Error ? err.message : "Update failed"),
        );
    },
    [draftFor, patch],
  );

  const onToggleEnabled = useCallback(
    (item: AdminNavItem) => {
      void patch
        .mutateAsync({
          id: item.id,
          body: { enabled: !item.enabled },
        })
        .then(() => toast.success(item.enabled ? "Disabled" : "Enabled"))
        .catch((err) =>
          toast.error(err instanceof Error ? err.message : "Update failed"),
        );
    },
    [patch],
  );

  const tableState = useClientDataTable({
    data: items,
    getSearchText: (i) => [i.key, i.label, i.href].filter(Boolean).join(" "),
    getSortValue: (i, id) =>
      (i as Record<string, unknown>)[id] as string | number | null | undefined,
  });

  const columns = useMemo(
    () =>
      createNavigationAdminColumns({
        drafts,
        onDraftChange: (id, field, value) => {
          const item = items.find((i) => i.id === id);
          if (!item) return;
          onDraftChange(item, field, value);
        },
        onSave,
        onToggleEnabled,
        savePending: patch.isPending,
      }),
    [drafts, items, onDraftChange, onSave, onToggleEnabled, patch.isPending],
  );

  const toolbarFilters = showAreaFilter ? (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">Menu area</p>
      <AppReactSelect
        portalMenu
        options={AREA_OPTIONS}
        value={stringSelectValue(AREA_OPTIONS, areaFilter)}
        onChange={(opt) => {
          const next = opt?.value ? String(opt.value) : "backoffice";
          onAreaChange(next === "dashboard" ? "dashboard" : "backoffice");
        }}
        isSearchable={false}
        aria-label="Navigation area"
      />
    </div>
  ) : undefined;

  return (
    <DataTable
      tableId={`navigation-admin-${sectionId}`}
      columns={columns}
      data={tableState.data}
      totalCount={tableState.totalCount}
      pagination={tableState.pagination}
      onPaginationChange={tableState.onPaginationChange}
      sorting={tableState.sorting}
      onSortingChange={tableState.onSortingChange}
      search={tableState.search}
      onSearchChange={tableState.onSearchChange}
      toolbarFilters={toolbarFilters}
      filterActive={showAreaFilter && areaFilter !== "backoffice"}
      getRowId={(row) => row.id}
      ariaLabel="Navigation items"
      pageSizeOptions={[10, 20, 50]}
    />
  );
}

export function NavigationAdminPage() {
  const [area, setArea] = useState<Area>("backoffice");
  const query = useAdminNavigation(area);

  const sections = useMemo(() => query.data?.sections ?? [], [query.data]);

  if (query.isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Navigation</h1>
        <p className="text-sm text-muted-foreground">
          Edit DB-backed menus for dashboard and backoffice (SUPERADMIN).
        </p>
      </div>

      {query.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {query.error instanceof Error
            ? query.error.message
            : "Unable to load navigation"}
        </p>
      ) : null}

      {sections.map((section, sectionIndex) => (
        <div key={section.id} className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-medium">
              Section: {section.label ?? section.key}{" "}
              <span className="font-mono text-xs text-muted-foreground">
                ({section.key})
              </span>
            </h2>
            <AddNavigationItemDialog
              sectionId={section.id}
              nextSort={
                section.items.reduce((max, i) => Math.max(max, i.sortOrder), -1) +
                1
              }
            />
          </div>
          <NavigationSectionTable
            sectionId={section.id}
            items={section.items}
            areaFilter={area}
            onAreaChange={setArea}
            showAreaFilter={sectionIndex === 0}
          />
        </div>
      ))}
    </div>
  );
}
