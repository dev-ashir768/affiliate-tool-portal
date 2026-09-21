"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  useCampaigns,
  useCreateCampaign,
  usePatchCampaign,
} from "@/hooks/use-creators";
import type { CampaignStatus } from "@/types/creators";
import { cn } from "cn";

const STATUSES: CampaignStatus[] = ["DRAFT", "ACTIVE", "PAUSED", "DONE"];

export function CampaignsPageContent() {
  const query = useCampaigns();
  const create = useCreateCampaign();
  const patch = usePatchCampaign();
  const [name, setName] = useState("");
  const [brief, setBrief] = useState("");

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await create.mutateAsync({
        name: name.trim(),
        brief: brief.trim() || null,
      });
      setName("");
      setBrief("");
      toast.success("Campaign created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create");
    }
  }

  if (query.isLoading) return <Skeleton className="h-48 w-full" />;

  const campaigns = query.data?.campaigns ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Campaigns</h1>
        <p className="text-sm text-muted-foreground">
          Briefs and offers for creator outreach.
        </p>
      </div>

      <form onSubmit={(e) => void onCreate(e)} className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Campaign name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Creating…" : "Create"}
          </Button>
        </div>
        <Input
          placeholder="Brief (optional)"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        />
      </form>

      {query.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {query.error instanceof Error
            ? query.error.message
            : "Unable to load campaigns"}
        </p>
      ) : null}

      <ul className="space-y-3">
        {campaigns.length === 0 ? (
          <li className="rounded-xl border border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No campaigns yet.
          </li>
        ) : (
          campaigns.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border px-4 py-3"
            >
              <div className="space-y-1">
                <p className="font-medium">{c.name}</p>
                {c.brief ? (
                  <p className="text-sm text-muted-foreground">{c.brief}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-md",
                    c.status === "ACTIVE" &&
                      "border-transparent bg-primary text-primary-foreground",
                  )}
                >
                  {c.status}
                </Badge>
                <select
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                  value={c.status}
                  onChange={(e) => {
                    void patch
                      .mutateAsync({
                        id: c.id,
                        body: { status: e.target.value },
                      })
                      .then(() => toast.success("Status updated"))
                      .catch((err) =>
                        toast.error(
                          err instanceof Error ? err.message : "Update failed",
                        ),
                      );
                  }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
