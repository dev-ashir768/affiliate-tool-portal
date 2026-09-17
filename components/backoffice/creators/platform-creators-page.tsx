"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  useCreatePlatformCreator,
  usePatchPlatformCreator,
  usePlatformCreators,
  usePlatformOrganizations,
} from "@/hooks/use-platform";

const STAGES = ["LEAD", "CONTACTED", "INVITED", "ACTIVE", "REJECTED"] as const;

export function PlatformCreatorsPageContent() {
  const orgsQuery = usePlatformOrganizations({
    page: 1,
    pageSize: 100,
    sortBy: "name",
    sortOrder: "asc",
  });
  const [orgFilter, setOrgFilter] = useState("");
  const [search, setSearch] = useState("");
  const creatorsQuery = usePlatformCreators({
    page: 1,
    pageSize: 50,
    search: search || undefined,
    organizationId: orgFilter || undefined,
  });
  const create = useCreatePlatformCreator();
  const patch = usePatchPlatformCreator();

  const [organizationId, setOrganizationId] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");

  const orgs = orgsQuery.data?.data ?? [];
  const creators = creatorsQuery.data?.data ?? [];

  const orgOptions = useMemo(
    () => orgs.map((o) => ({ id: o.id, label: `${o.name} (${o.slug})` })),
    [orgs],
  );

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!organizationId || !handle.trim()) {
      toast.error("Organization and handle are required");
      return;
    }
    try {
      await create.mutateAsync({
        organizationId,
        handle: handle.trim(),
        displayName: displayName.trim() || null,
        contactEmail: email.trim() || null,
      });
      setHandle("");
      setEmail("");
      setDisplayName("");
      toast.success("Creator added to organization");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add");
    }
  }

  if (orgsQuery.isLoading) return <Skeleton className="h-48 w-full" />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Creators</h1>
        <p className="text-sm text-muted-foreground">
          Platform staff can add creators into any merchant organization. Ops /
          Superadmin only.
        </p>
      </div>

      <form
        onSubmit={(e) => void onCreate(e)}
        className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="space-y-1 sm:col-span-2 lg:col-span-1">
          <label className="text-xs text-muted-foreground">Organization</label>
          <select
            className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm"
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
            required
          >
            <option value="">Select org…</option>
            {orgOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Handle</label>
          <Input
            placeholder="@creator"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Display name</label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Contact email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Adding…" : "Add creator"}
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search handle / org…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          className="rounded-md border border-border bg-background px-2 py-2 text-sm"
          value={orgFilter}
          onChange={(e) => setOrgFilter(e.target.value)}
        >
          <option value="">All organizations</option>
          {orgOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {creatorsQuery.isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : creatorsQuery.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {creatorsQuery.error instanceof Error
            ? creatorsQuery.error.message
            : "Unable to load creators"}
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30 text-left text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Org</th>
                <th className="px-3 py-2 font-medium">Handle</th>
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">Stage</th>
              </tr>
            </thead>
            <tbody>
              {creators.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-8 text-center text-muted-foreground"
                  >
                    No creators yet.
                  </td>
                </tr>
              ) : (
                creators.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-3 py-2">{c.organization.name}</td>
                    <td className="px-3 py-2 font-medium">@{c.handle}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {c.contactEmail ?? "—"}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="rounded-md">
                          {c.stage}
                        </Badge>
                        <select
                          className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                          value={c.stage}
                          onChange={(e) => {
                            void patch
                              .mutateAsync({
                                id: c.id,
                                body: { stage: e.target.value },
                              })
                              .then(() => toast.success("Stage updated"))
                              .catch((err) =>
                                toast.error(
                                  err instanceof Error
                                    ? err.message
                                    : "Update failed",
                                ),
                              );
                          }}
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
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
