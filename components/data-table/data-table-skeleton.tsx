"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = { columnCount?: number; rowCount?: number };

export function DataTableSkeleton({
  columnCount = 6,
  rowCount = 8,
}: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-200">
          {Array.from({ length: columnCount }).map((_, i) => (
            <TableHead key={i} className="px-4">
              <Skeleton className="h-4 w-24" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, r) => (
          <TableRow key={r}>
            {Array.from({ length: columnCount }).map((_, c) => (
              <TableCell key={c} className="p-4">
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
