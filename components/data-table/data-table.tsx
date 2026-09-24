"use client";

import { useCallback } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DraggableProvided,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  flexRender,
  useTable,
  type Header,
  type HeaderGroup,
} from "@tanstack/react-table";
import { Grip } from "lucide-react";
import { cn } from "cn";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableEmpty } from "@/components/data-table/data-table-empty";
import { DataTableError } from "@/components/data-table/data-table-error";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTablePreferences } from "@/components/data-table/hooks/use-data-table-preferences";
import {
  dataTableFeatures,
  type DataTableFeatures,
  type DataTableProps,
} from "@/components/data-table/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type DataTableComponentProps<TData extends object> =
  DataTableProps<TData>;

function resolveColumnOrder(
  storedOrder: string[],
  leafIds: string[],
): string[] {
  if (storedOrder.length === 0) return leafIds;
  const leafSet = new Set(leafIds);
  const kept = storedOrder.filter((id) => leafSet.has(id));
  const keptSet = new Set(kept);
  return [...kept, ...leafIds.filter((id) => !keptSet.has(id))];
}

function reorderVisibleColumns(
  fullOrder: string[],
  visibleOrder: string[],
  fromIndex: number,
  toIndex: number,
): string[] {
  const nextVisible = [...visibleOrder];
  const [moved] = nextVisible.splice(fromIndex, 1);
  if (moved == null) return fullOrder;
  nextVisible.splice(toIndex, 0, moved);

  const visibleSet = new Set(nextVisible);
  let i = 0;
  return fullOrder.map((id) => (visibleSet.has(id) ? nextVisible[i++]! : id));
}

function getHeaderTitle<TData extends object>(
  header: Header<DataTableFeatures, TData, unknown>,
): string {
  const def = header.column.columnDef.header;
  return typeof def === "string" && def.length > 0 ? def : header.column.id;
}

function isCustomColumnHeader<TData extends object>(
  header: Header<DataTableFeatures, TData, unknown>,
): boolean {
  const def = header.column.columnDef.header;
  return typeof def === "function" || (def != null && typeof def !== "string");
}

function getAriaSort<TData extends object>(
  header: Header<DataTableFeatures, TData, unknown>,
): "ascending" | "descending" | "none" | undefined {
  if (!header.column.getCanSort()) return undefined;
  const sorted = header.column.getIsSorted();
  if (sorted === "asc") return "ascending";
  if (sorted === "desc") return "descending";
  return "none";
}

function DataTableHeaderCell<TData extends object>({
  header,
  enableColumnOrdering,
  enableColumnResizing,
  dragHandle,
}: {
  header: Header<DataTableFeatures, TData, unknown>;
  enableColumnOrdering: boolean;
  enableColumnResizing: boolean;
  dragHandle?: DraggableProvided;
}) {
  const canResize = enableColumnResizing && header.column.getCanResize();
  const showDragHandle =
    enableColumnOrdering && dragHandle != null && !header.isPlaceholder;
  const totalSize = header.getContext().table.getTotalSize();
  const sizeStyle = {
    width: `${(header.getSize() / totalSize) * 100}%`,
    minWidth: header.column.columnDef.minSize ?? 80,
    ...(dragHandle?.draggableProps.style ?? {}),
  };

  return (
    <TableHead
      ref={dragHandle?.innerRef}
      colSpan={header.colSpan}
      aria-sort={getAriaSort(header)}
      {...dragHandle?.draggableProps}
      style={sizeStyle}
      className="group/th relative h-9 px-3 bg-gray-200"
    >
      <div className="flex items-center gap-1.5">
        {showDragHandle ? (
          <span
            className="inline-flex size-5 shrink-0 cursor-grab items-center justify-center text-muted-foreground/60 hover:text-foreground"
            aria-label="Reorder column"
            {...dragHandle?.dragHandleProps}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
          >
            <Grip className="size-3.5" />
          </span>
        ) : null}
        {header.isPlaceholder ? null : isCustomColumnHeader(header) ? (
          flexRender(header.column.columnDef.header, header.getContext())
        ) : (
          <DataTableColumnHeader
            column={header.column}
            title={getHeaderTitle(header)}
          />
        )}
      </div>
      {canResize ? (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize column"
          className={cn(
            "absolute inset-y-0 right-0 w-1 cursor-col-resize touch-none select-none bg-border opacity-0 group-hover/th:opacity-100 hover:opacity-100",
            header.column.getIsResizing() && "bg-primary opacity-100",
          )}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          onPointerDown={(event) => event.stopPropagation()}
        />
      ) : null}
    </TableHead>
  );
}

function DataTableHeaderRow<TData extends object>({
  headerGroup,
  enableColumnOrdering,
  enableColumnResizing,
}: {
  headerGroup: HeaderGroup<DataTableFeatures, TData>;
  enableColumnOrdering: boolean;
  enableColumnResizing: boolean;
}) {
  if (!enableColumnOrdering) {
    return (
      <TableRow>
        {headerGroup.headers.map((header) => (
          <DataTableHeaderCell
            key={header.id}
            header={header}
            enableColumnOrdering={false}
            enableColumnResizing={enableColumnResizing}
          />
        ))}
      </TableRow>
    );
  }

  return (
    <Droppable
      droppableId={headerGroup.id}
      direction="horizontal"
      type="COLUMN"
    >
      {(provided) => (
        <TableRow ref={provided.innerRef} {...provided.droppableProps}>
          {headerGroup.headers.map((header, index) => (
            <Draggable
              key={header.id}
              draggableId={header.column.id}
              index={index}
              isDragDisabled={header.isPlaceholder}
            >
              {(dragHandle) => (
                <DataTableHeaderCell
                  header={header}
                  enableColumnOrdering
                  enableColumnResizing={enableColumnResizing}
                  dragHandle={dragHandle}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </TableRow>
      )}
    </Droppable>
  );
}

export function DataTable<TData extends object>({
  tableId,
  columns,
  data,
  totalCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  search,
  onSearchChange,
  isLoading = false,
  isFetching = false,
  isError = false,
  onRetry,
  onExport,
  onRefresh,
  onFiltersClick,
  toolbarLeading,
  enableColumnResizing,
  enableColumnOrdering = false,
  pageSizeOptions,
  getRowId,
  ariaLabel = "Data table",
}: DataTableComponentProps<TData>) {
  const prefs = useDataTablePreferences(tableId);
  const columnResizingEnabled = enableColumnResizing ?? true;

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    getRowId,
    manualPagination: true,
    manualSorting: true,
    rowCount: totalCount,
    state: {
      pagination,
      sorting,
      columnVisibility: prefs.columnVisibility,
      columnOrder: prefs.columnOrder,
      columnSizing: prefs.columnSizing,
    },
    onPaginationChange,
    onSortingChange,
    onColumnVisibilityChange: prefs.setColumnVisibility,
    onColumnOrderChange: prefs.setColumnOrder,
    onColumnSizingChange: prefs.setColumnSizing,
    enableColumnResizing: columnResizingEnabled,
    columnResizeMode: "onChange",
    defaultColumn: {
      minSize: 80,
      size: 160,
      maxSize: 480,
    },
  });

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      if (result.source.index === result.destination.index) return;

      const leafIds = table.getAllLeafColumns().map((column) => column.id);
      const visibleIds = table
        .getVisibleLeafColumns()
        .map((column) => column.id);
      const nextOrder = reorderVisibleColumns(
        resolveColumnOrder(prefs.columnOrder, leafIds),
        visibleIds,
        result.source.index,
        result.destination.index,
      );
      table.setColumnOrder(nextOrder);
    },
    [prefs.columnOrder, table],
  );

  const showFullError = isError && data.length === 0;
  const showInlineError = isError && data.length > 0;
  const isSoftFetching = isFetching && !isLoading;
  const rows = table.getRowModel().rows;
  const visibleColumnCount = Math.max(table.getVisibleLeafColumns().length, 1);
  const headerGroups = table.getHeaderGroups();

  const totalSize = Math.max(table.getTotalSize(), 1);

  const tableGrid = (
    <Table aria-label={ariaLabel} className="w-full table-fixed">
      <TableHeader className="bg-gray-200">
        {headerGroups.map((headerGroup) => (
          <DataTableHeaderRow
            key={headerGroup.id}
            headerGroup={headerGroup}
            enableColumnOrdering={enableColumnOrdering}
            enableColumnResizing={columnResizingEnabled}
          />
        ))}
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={visibleColumnCount} className="h-24">
              <DataTableEmpty
                search={search}
                onClearSearch={() => onSearchChange("")}
              />
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-muted/40">
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  style={{
                    width: `${(cell.column.getSize() / totalSize) * 100}%`,
                    minWidth: cell.column.columnDef.minSize ?? 80,
                  }}
                  className="p-3 text-sm text-foreground"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  const orderedTable = enableColumnOrdering ? (
    <DragDropContext onDragEnd={handleDragEnd}>{tableGrid}</DragDropContext>
  ) : (
    tableGrid
  );

  return (
    <div className="flex w-full flex-col gap-3 bg-card rounded-xl overflow-hidden py-3">
      <DataTableToolbar
        table={table}
        search={search}
        onSearchChange={onSearchChange}
        onRefresh={onRefresh}
        onExport={onExport}
        onFiltersClick={onFiltersClick}
        leading={toolbarLeading}
        isFetching={isFetching}
      />

      {showFullError ? (
        <DataTableError onRetry={onRetry} />
      ) : isLoading ? (
        <DataTableSkeleton
          columnCount={visibleColumnCount}
          rowCount={Math.min(pagination.pageSize, 8)}
        />
      ) : (
        <>
          {showInlineError ? (
            <DataTableError variant="inline" onRetry={onRetry} />
          ) : null}
          <div className="relative" aria-busy={isSoftFetching || undefined}>
            <div className={cn(isSoftFetching && "opacity-60")}>
              {orderedTable}
            </div>
            {isSoftFetching ? (
              <div className="pointer-events-none absolute inset-0 bg-background/60" />
            ) : null}
          </div>
        </>
      )}

      {showFullError ? null : (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
