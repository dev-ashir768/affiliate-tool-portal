"use client";

import { useEffect, useMemo, useState } from "react";
import {
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type AuditRow = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  createdAt: string;
  actor: { id: string; email: string; name: string } | null;
  meta: unknown;
};

type AuditResponse = {
  data: AuditRow[];
  meta: { total: number; page: number; pageSize: number };
};

async function fetchAudit(
  params: { page: number; pageSize: number; search?: string },
  signal?: AbortSignal,
): Promise<AuditResponse> {
  const qs = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });
  if (params.search) qs.set("search", params.search);
  const res = await fetch(`/api/platform/audit?${qs}`, {
    credentials: "include",
    signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Failed to load audit logs");
  }
  return data as AuditResponse;
}

const createdAtFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function AuditLogPage() {
  const [params, setParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      pageSize: parseAsInteger.withDefault(20),
      search: parseAsString.withDefault(""),
    },
    { history: "replace", shallow: true },
  );
  const [searchDraft, setSearchDraft] = useState(params.search);

  const query = useQuery({
    queryKey: ["platform", "audit", params],
    queryFn: ({ signal }) =>
      fetchAudit(
        {
          page: params.page,
          pageSize: params.pageSize,
          search: params.search || undefined,
        },
        signal,
      ),
    retry: false,
  });

  const total = query.data?.meta.total ?? 0;
  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(total / Math.max(1, params.pageSize))),
    [total, params.pageSize],
  );

  useEffect(() => {
    if (params.page > pageCount) {
      void setParams({ page: pageCount });
    }
  }, [pageCount, params.page, setParams]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Audit log</h1>
        <p className="text-sm text-muted-foreground">
          Recent platform security and staff actions.
        </p>
      </div>

      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void setParams({ search: searchDraft, page: 1 });
        }}
      >
        <Input
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="Search action or entity…"
          className="max-w-sm"
        />
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {query.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : query.isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Unable to load audit log</CardTitle>
            <CardDescription>
              {query.error instanceof Error
                ? query.error.message
                : "Request failed"}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {(query.data?.data.length ?? 0) === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No events yet.</p>
            ) : (
              query.data?.data.map((row) => (
                <div
                  key={row.id}
                  className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{row.action}</p>
                    <p className="text-muted-foreground">
                      {row.entityType}
                      {row.entityId ? ` · ${row.entityId}` : ""}
                      {row.actor
                        ? ` · ${row.actor.name} <${row.actor.email}>`
                        : " · system"}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-muted-foreground">
                    {createdAtFormatter.format(new Date(row.createdAt))}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between gap-2 text-sm">
        <p className="text-muted-foreground">
          Page {params.page} of {pageCount} · {total} events
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={params.page <= 1}
            onClick={() => void setParams({ page: params.page - 1 })}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={params.page >= pageCount}
            onClick={() => void setParams({ page: params.page + 1 })}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
