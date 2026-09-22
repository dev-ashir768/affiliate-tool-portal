"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  useCampaigns,
  useCreateCampaign,
  useCreatorLists,
  usePatchCampaign,
  useRunCampaignAcrossShops,
} from "@/hooks/use-creators";
import { useInviteProducts } from "@/hooks/use-invites";
import { useShops } from "@/hooks/use-shops";
import type { CampaignStatus } from "@/types/creators";
import { cn } from "cn";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";

const STATUSES: CampaignStatus[] = ["DRAFT", "ACTIVE", "PAUSED", "DONE"];

const STATUS_OPTIONS: SelectOption[] = STATUSES.map((s) => ({
  value: s,
  label: s,
}));

function defaultEndAt(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 16);
}

export function CampaignsPageContent() {
  const query = useCampaigns();
  const create = useCreateCampaign();
  const patch = usePatchCampaign();
  const listsQuery = useCreatorLists();
  const shopsQuery = useShops();
  const multiRun = useRunCampaignAcrossShops();

  const [name, setName] = useState("");
  const [brief, setBrief] = useState("");

  const [runCampaignId, setRunCampaignId] = useState("");
  const [runShopIds, setRunShopIds] = useState<string[]>([]);
  const [runListId, setRunListId] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [productId, setProductId] = useState("");
  const [commissionPercent, setCommissionPercent] = useState("15");
  const [endAt, setEndAt] = useState(defaultEndAt);
  const [hasFreeSample, setHasFreeSample] = useState(false);

  const oauthShops = useMemo(
    () =>
      (shopsQuery.data?.shops ?? []).filter((s) => Boolean(s.oauthConnected)),
    [shopsQuery.data?.shops],
  );

  const primaryShopId = runShopIds[0] || oauthShops[0]?.id || null;
  const productsQuery = useInviteProducts(primaryShopId);

  const campaignOptions: SelectOption[] = useMemo(
    () =>
      (query.data?.campaigns ?? []).map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [query.data?.campaigns],
  );

  const listOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "Select a list" },
      ...(listsQuery.data?.lists ?? []).map((l) => ({
        value: l.id,
        label: `${l.name} (${l.memberCount})`,
      })),
    ],
    [listsQuery.data?.lists],
  );

  const productOptions: SelectOption[] = useMemo(
    () =>
      (productsQuery.data?.products ?? []).map((p) => ({
        value: p.id,
        label: p.title || p.id,
      })),
    [productsQuery.data?.products],
  );

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

  function toggleShop(id: string) {
    setRunShopIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 5) {
        toast.error("Max 5 shops");
        return prev;
      }
      return [...prev, id];
    });
  }

  async function onMultiRun(e: React.FormEvent) {
    e.preventDefault();
    if (!runCampaignId) {
      toast.error("Select a campaign");
      return;
    }
    if (runShopIds.length === 0) {
      toast.error("Select at least one shop");
      return;
    }
    if (!runListId) {
      toast.error("Select a creator list");
      return;
    }
    if (!productId) {
      toast.error("Select a product (from first selected shop)");
      return;
    }
    const pct = Number(commissionPercent);
    if (!Number.isFinite(pct) || pct < 10) {
      toast.error("Commission must be at least 10%");
      return;
    }
    try {
      const result = await multiRun.mutateAsync({
        campaignId: runCampaignId,
        body: {
          shopIds: runShopIds,
          listId: runListId,
          inviteName:
            inviteName.trim() ||
            campaignOptions.find((c) => c.value === runCampaignId)?.label ||
            "Multi-shop invite",
          endAt: new Date(endAt).toISOString(),
          hasFreeSample,
          sampleApprovalExempt: hasFreeSample,
          products: [{ id: productId, commissionPercent: pct }],
        },
      });
      toast.success(
        `Queued on ${result.okCount} shop(s)` +
          (result.failCount ? `, ${result.failCount} failed` : ""),
      );
      for (const r of result.results.filter((x) => !x.ok)) {
        toast.error(`${r.shopName ?? r.shopId}: ${r.error}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Multi-shop run failed");
    }
  }

  if (query.isLoading) return <Skeleton className="h-48 w-full" />;

  const campaigns = query.data?.campaigns ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Campaigns</h1>
        <p className="text-sm text-muted-foreground">
          Briefs and multi-shop invite runs for creator outreach.
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

      <section className="space-y-3 rounded-xl border border-border p-4">
        <div>
          <h2 className="text-sm font-semibold">Multi-shop run</h2>
          <p className="text-xs text-muted-foreground">
            Queue the same target collaboration invite across up to 5 OAuth
            shops using one creator list. Product picker uses the first selected
            shop&apos;s catalog — product IDs must exist on each shop.
          </p>
        </div>
        <form
          onSubmit={(e) => void onMultiRun(e)}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-wrap gap-2">
            <AppReactSelect
              className="min-w-48"
              options={campaignOptions}
              value={stringSelectValue(campaignOptions, runCampaignId)}
              onChange={(opt) =>
                setRunCampaignId(opt?.value ? String(opt.value) : "")
              }
              placeholder="Campaign"
              isSearchable
              aria-label="Campaign"
            />
            <AppReactSelect
              className="min-w-48"
              options={listOptions}
              value={stringSelectValue(listOptions, runListId)}
              onChange={(opt) =>
                setRunListId(opt?.value ? String(opt.value) : "")
              }
              isSearchable
              aria-label="Creator list"
            />
            <Input
              placeholder="Invite name"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="max-w-xs"
            />
            <Input
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
            <Input
              type="number"
              min={10}
              max={80}
              step={0.01}
              value={commissionPercent}
              onChange={(e) => setCommissionPercent(e.target.value)}
              className="w-24"
              aria-label="Commission %"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <AppReactSelect
              className="min-w-56"
              options={productOptions}
              value={stringSelectValue(productOptions, productId)}
              onChange={(opt) =>
                setProductId(opt?.value ? String(opt.value) : "")
              }
              placeholder="Product (first shop)"
              isSearchable
              isDisabled={!primaryShopId}
              aria-label="Product"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hasFreeSample}
                onChange={(e) => setHasFreeSample(e.target.checked)}
              />
              Free sample
            </label>
            <Button type="submit" disabled={multiRun.isPending}>
              {multiRun.isPending ? "Queuing…" : "Queue multi-shop invites"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {oauthShops.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No OAuth shops — authorize shops first.
              </p>
            ) : (
              oauthShops.map((s) => (
                <label
                  key={s.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-2 py-1 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={runShopIds.includes(s.id)}
                    onChange={() => toggleShop(s.id)}
                  />
                  {s.displayName || s.id} ({s.region})
                </label>
              ))
            )}
          </div>
        </form>
      </section>

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
                <AppReactSelect
                  className="min-w-32"
                  size="sm"
                  options={STATUS_OPTIONS}
                  value={stringSelectValue(STATUS_OPTIONS, c.status)}
                  onChange={(opt) => {
                    const status = opt?.value ? String(opt.value) : "";
                    if (!status) return;
                    void patch
                      .mutateAsync({
                        id: c.id,
                        body: { status },
                      })
                      .then(() => toast.success("Status updated"))
                      .catch((err) =>
                        toast.error(
                          err instanceof Error ? err.message : "Update failed",
                        ),
                      );
                  }}
                  isSearchable={false}
                  aria-label={`Status for ${c.name}`}
                />
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
