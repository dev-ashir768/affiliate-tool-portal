"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreatePlatformDiscovery,
  usePlatformDiscovery,
} from "@/hooks/use-commerce";

export function PlatformDiscoveryPageContent() {
  const [search, setSearch] = useState("");
  const query = usePlatformDiscovery({ search: search || undefined });
  const create = useCreatePlatformDiscovery();
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [followers, setFollowers] = useState("");
  const [region, setRegion] = useState<"US" | "UK" | "">("");

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!handle.trim()) return;
    try {
      await create.mutateAsync({
        handle: handle.trim(),
        displayName: displayName.trim() || null,
        region: region || null,
        followerCount: followers ? Number(followers) : null,
      });
      setHandle("");
      setDisplayName("");
      setFollowers("");
      setRegion("");
      toast.success("Added to discovery index");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  if (query.isLoading) return <Skeleton className="h-48 w-full" />;
  const rows = query.data?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Discovery index</h1>
        <p className="text-sm text-muted-foreground">
          Build the shared creator catalog merchants search on /discover. No
          live TikTok scrape here — import/manual only for now.
        </p>
      </div>

      <form
        onSubmit={(e) => void onCreate(e)}
        className="grid gap-2 rounded-xl border border-border p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <Input
          placeholder="@handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          required
        />
        <Input
          placeholder="Display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <Input
          placeholder="Followers"
          value={followers}
          onChange={(e) => setFollowers(e.target.value)}
        />
        <select
          className="rounded-md border border-border bg-background px-2 py-2 text-sm"
          value={region}
          onChange={(e) => setRegion(e.target.value as "US" | "UK" | "")}
        >
          <option value="">Region</option>
          <option value="US">US</option>
          <option value="UK">UK</option>
        </select>
        <Button type="submit" disabled={create.isPending}>
          Add profile
        </Button>
      </form>

      <Input
        placeholder="Filter…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-left text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Handle</th>
              <th className="px-3 py-2 font-medium">Region</th>
              <th className="px-3 py-2 font-medium">Followers</th>
              <th className="px-3 py-2 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-medium">@{p.handle}</td>
                <td className="px-3 py-2">{p.region ?? "—"}</td>
                <td className="px-3 py-2">
                  {p.followerCount?.toLocaleString() ?? "—"}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {p.source}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
