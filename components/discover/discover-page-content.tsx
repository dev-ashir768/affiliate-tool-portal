"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDiscoverySearch,
  useSaveDiscoveryToCrm,
} from "@/hooks/use-commerce";

export function DiscoverPageContent() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const query = useDiscoverySearch({
    search: search || undefined,
    region: region || undefined,
  });
  const save = useSaveDiscoveryToCrm();

  if (query.isLoading) return <Skeleton className="h-48 w-full" />;

  const rows = query.data?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Discover</h1>
        <p className="text-sm text-muted-foreground">
          Search the shared discovery index and save creators into your CRM.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search handle or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          className="rounded-md border border-border bg-background px-2 py-2 text-sm"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="">All regions</option>
          <option value="US">US</option>
          <option value="UK">UK</option>
        </select>
      </div>

      {query.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {query.error instanceof Error
            ? query.error.message
            : "Unable to load discovery"}
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30 text-left text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Handle</th>
                <th className="px-3 py-2 font-medium">Region</th>
                <th className="px-3 py-2 font-medium">Followers</th>
                <th className="px-3 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-8 text-center text-muted-foreground"
                  >
                    No discovery profiles yet. Ask platform ops to import.
                  </td>
                </tr>
              ) : (
                rows.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-3 py-2">
                      <div className="font-medium">@{p.handle}</div>
                      {p.displayName ? (
                        <div className="text-xs text-muted-foreground">
                          {p.displayName}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-3 py-2">{p.region ?? "—"}</td>
                    <td className="px-3 py-2">
                      {p.followerCount?.toLocaleString() ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={save.isPending}
                        onClick={() => {
                          void save
                            .mutateAsync(p.id)
                            .then(() => toast.success("Saved to CRM"))
                            .catch((err) =>
                              toast.error(
                                err instanceof Error
                                  ? err.message
                                  : "Save failed",
                              ),
                            );
                        }}
                      >
                        Save to CRM
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
