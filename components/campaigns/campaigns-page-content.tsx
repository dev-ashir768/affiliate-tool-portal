"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { FormGrid, SectionCard } from "@/components/layout/section-card";
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

  if (query.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-14 w-full max-w-md" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full lg:col-span-2" />
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const campaigns = query.data?.campaigns ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Campaigns"
        description="Briefs and multi-shop invite runs for creator outreach."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="New campaign"
          description="Give it a name and an optional brief for creators."
        >
          <form
            onSubmit={(e) => void onCreate(e)}
            className="flex h-full flex-col gap-4"
          >
            <Field>
              <FieldLabel htmlFor="campaign-name">Campaign name</FieldLabel>
              <Input
                id="campaign-name"
                placeholder="e.g. Summer skincare launch"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="campaign-brief">Brief</FieldLabel>
              <Textarea
                id="campaign-brief"
                placeholder="What should creators know? (optional)"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                rows={4}
              />
            </Field>
            <Button
              type="submit"
              size="lg"
              className="mt-auto self-end"
              disabled={create.isPending || !name.trim()}
            >
              {create.isPending ? "Creating…" : "Create campaign"}
            </Button>
          </form>
        </SectionCard>

        <SectionCard
          className="lg:col-span-2"
          title="Multi-shop run"
          description="Queue the same collaboration invite across up to 5 authorized shops using one creator list. Products come from the first selected shop's catalog — product IDs must exist on each shop."
        >
          <form
            onSubmit={(e) => void onMultiRun(e)}
            className="flex flex-col gap-5"
          >
            <FormGrid columns={2}>
              <Field>
                <FieldLabel>Campaign</FieldLabel>
                <AppReactSelect
                  options={campaignOptions}
                  value={stringSelectValue(campaignOptions, runCampaignId)}
                  onChange={(opt) =>
                    setRunCampaignId(opt?.value ? String(opt.value) : "")
                  }
                  placeholder="Select a campaign"
                  isSearchable
                  aria-label="Campaign"
                />
              </Field>
              <Field>
                <FieldLabel>Creator list</FieldLabel>
                <AppReactSelect
                  options={listOptions}
                  value={stringSelectValue(listOptions, runListId)}
                  onChange={(opt) =>
                    setRunListId(opt?.value ? String(opt.value) : "")
                  }
                  placeholder="Select a list"
                  isSearchable
                  aria-label="Creator list"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="run-invite-name">Invite name</FieldLabel>
                <Input
                  id="run-invite-name"
                  placeholder="Defaults to the campaign name"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Product</FieldLabel>
                <AppReactSelect
                  options={productOptions}
                  value={stringSelectValue(productOptions, productId)}
                  onChange={(opt) =>
                    setProductId(opt?.value ? String(opt.value) : "")
                  }
                  placeholder={
                    primaryShopId ? "Select a product" : "Select a shop first"
                  }
                  isSearchable
                  isDisabled={!primaryShopId}
                  aria-label="Product"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="run-end-at">Invite ends</FieldLabel>
                <Input
                  id="run-end-at"
                  type="datetime-local"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="run-commission">Commission %</FieldLabel>
                <Input
                  id="run-commission"
                  type="number"
                  min={10}
                  max={80}
                  step={0.01}
                  value={commissionPercent}
                  onChange={(e) => setCommissionPercent(e.target.value)}
                />
              </Field>
            </FormGrid>

            <Field>
              <FieldLabel>Shops</FieldLabel>
              {oauthShops.length === 0 ? (
                <p className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
                  No authorized shops yet — authorize a TikTok Shop on the
                  Shops page first.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {oauthShops.map((s) => {
                    const checked = runShopIds.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className={cn(
                          "flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm transition-colors",
                          checked
                            ? "border-primary bg-primary/5"
                            : "border-input hover:bg-muted",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="size-4 accent-primary"
                          checked={checked}
                          onChange={() => toggleShop(s.id)}
                        />
                        {s.displayName || s.id}
                        <span className="text-xs text-muted-foreground">
                          {s.region}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </Field>

            <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  checked={hasFreeSample}
                  onChange={(e) => setHasFreeSample(e.target.checked)}
                />
                Offer a free sample
              </label>
              <Button type="submit" size="lg" disabled={multiRun.isPending}>
                {multiRun.isPending ? "Queuing…" : "Queue multi-shop invites"}
              </Button>
            </div>
          </form>
        </SectionCard>
      </div>

      <SectionCard
        title="All campaigns"
        description={`${campaigns.length} campaign${campaigns.length === 1 ? "" : "s"}`}
        contentClassName="px-0"
      >
        {query.isError ? (
          <p className="px-4 text-sm text-destructive" role="alert">
            {query.error instanceof Error
              ? query.error.message
              : "Unable to load campaigns"}
          </p>
        ) : campaigns.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No campaigns yet. Create your first one above.
          </p>
        ) : (
          <ul className="divide-y">
            {campaigns.map((c) => (
              <li
                key={c.id}
                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-0.5">
                  <p className="truncate font-medium">{c.name}</p>
                  {c.brief ? (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {c.brief}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
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
                    className="w-36"
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
                            err instanceof Error
                              ? err.message
                              : "Update failed",
                          ),
                        );
                    }}
                    isSearchable={false}
                    aria-label={`Status for ${c.name}`}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
