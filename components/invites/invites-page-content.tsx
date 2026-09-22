"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useCampaigns, useCreatorLists, useCreators } from "@/hooks/use-creators";
import { useShops } from "@/hooks/use-shops";
import {
  useAffiliateInvites,
  useCreateAffiliateInvite,
  useInviteProducts,
} from "@/hooks/use-invites";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";

function defaultEndAt(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 16);
}

export function InvitesPageContent() {
  const shopsQuery = useShops();
  const creatorsQuery = useCreators();
  const listsQuery = useCreatorLists();
  const campaignsQuery = useCampaigns();
  const invitesQuery = useAffiliateInvites();
  const createInvite = useCreateAffiliateInvite();

  const oauthShops = useMemo(
    () =>
      (shopsQuery.data?.shops ?? []).filter((s) => Boolean(s.oauthConnected)),
    [shopsQuery.data?.shops],
  );

  const [shopId, setShopId] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [listId, setListId] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState(
    "We'd love to collaborate — exclusive commission on these products.",
  );
  const [endAt, setEndAt] = useState(defaultEndAt);
  const [sellerEmail, setSellerEmail] = useState("");
  const [commissionPercent, setCommissionPercent] = useState("15");
  const [hasFreeSample, setHasFreeSample] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<Set<string>>(
    new Set(),
  );

  const activeShopId = shopId || oauthShops[0]?.id || null;
  const productsQuery = useInviteProducts(activeShopId);

  const creators = useMemo(
    () => creatorsQuery.data?.creators ?? [],
    [creatorsQuery.data?.creators],
  );
  const withOpenId = useMemo(
    () => creators.filter((c) => Boolean(c.creatorOpenId)),
    [creators],
  );

  const campaigns = useMemo(
    () => campaignsQuery.data?.campaigns ?? [],
    [campaignsQuery.data?.campaigns],
  );

  const shopOptions: SelectOption[] = useMemo(() => {
    if (oauthShops.length === 0) {
      return [{ value: "", label: "No OAuth shop" }];
    }
    return oauthShops.map((s) => ({
      value: s.id,
      label: `${s.displayName || s.id} (${s.region})`,
    }));
  }, [oauthShops]);

  const campaignOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "None" },
      ...campaigns.map((c) => ({ value: c.id, label: c.name })),
    ],
    [campaigns],
  );

  const listOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "No list (pick creators)" },
      ...(listsQuery.data?.lists ?? []).map((l) => ({
        value: l.id,
        label: `${l.name} (${l.memberCount})`,
      })),
    ],
    [listsQuery.data?.lists],
  );

  function toggleProduct(id: string) {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleCreator(id: string) {
    setSelectedCreatorIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sid = activeShopId;
    if (!sid) {
      toast.error("Select an OAuth-connected shop");
      return;
    }
    if (!name.trim()) {
      toast.error("Invite name required");
      return;
    }
    if (selectedProductIds.size === 0) {
      toast.error("Select at least one product");
      return;
    }
    if (!listId && selectedCreatorIds.size === 0) {
      toast.error("Select a list or at least one creator");
      return;
    }
    const pct = Number(commissionPercent);
    if (!Number.isFinite(pct) || pct < 10) {
      toast.error("Commission must be at least 10%");
      return;
    }

    try {
      const result = await createInvite.mutateAsync({
        shopId: sid,
        campaignId: campaignId || null,
        name: name.trim(),
        message: message.trim() || null,
        endAt: new Date(endAt).toISOString(),
        sellerContactEmail: sellerEmail.trim() || null,
        hasFreeSample,
        sampleApprovalExempt: hasFreeSample,
        products: [...selectedProductIds].map((id) => ({
          id,
          commissionPercent: pct,
        })),
        ...(listId
          ? { listId }
          : { creatorIds: [...selectedCreatorIds] }),
        sync: false,
      });
      const skipped = result.skipped?.length ?? 0;
      const truncated = result.list?.truncated
        ? ` (list had ${result.list.totalMembers}, capped at 50)`
        : "";
      toast.success(
        result.status === "QUEUED"
          ? `Queued invite (${result.invite.recipients.length} creators${skipped ? `, ${skipped} skipped` : ""}${truncated})`
          : `Invite ${result.status.toLowerCase()}`,
      );
      setSelectedCreatorIds(new Set());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invite failed");
    }
  }

  if (shopsQuery.isLoading || creatorsQuery.isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  const products = productsQuery.data?.products ?? [];
  const invites = invitesQuery.data?.invites ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">
          Affiliate invites
        </h1>
        <p className="text-sm text-muted-foreground">
          Create TikTok Shop target collaborations — private product invites
          with commission. Creators need a{" "}
          <code className="text-xs">creatorOpenId</code> from Discover sync.
        </p>
      </div>

      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="min-w-[10rem] space-y-1">
            <label className="text-xs text-muted-foreground">Shop</label>
            <AppReactSelect
              className="min-w-40 w-full"
              options={shopOptions}
              value={stringSelectValue(shopOptions, activeShopId ?? "")}
              onChange={(opt) => {
                setShopId(opt?.value ? String(opt.value) : "");
                setSelectedProductIds(new Set());
              }}
              isSearchable={oauthShops.length > 8}
              isDisabled={oauthShops.length === 0}
              aria-label="Shop"
            />
          </div>
          <div className="min-w-[10rem] flex-1 space-y-1">
            <label className="text-xs text-muted-foreground">Invite name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Spring collab"
            />
          </div>
          <div className="min-w-[10rem] space-y-1">
            <label className="text-xs text-muted-foreground">Ends</label>
            <Input
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
          </div>
          <div className="min-w-[6rem] space-y-1">
            <label className="text-xs text-muted-foreground">Commission %</label>
            <Input
              type="number"
              min={10}
              max={80}
              step={0.01}
              value={commissionPercent}
              onChange={(e) => setCommissionPercent(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="min-w-[12rem] flex-1 space-y-1">
            <label className="text-xs text-muted-foreground">
              Message to creators
            </label>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="min-w-[10rem] space-y-1">
            <label className="text-xs text-muted-foreground">
              Seller contact email
            </label>
            <Input
              type="email"
              value={sellerEmail}
              onChange={(e) => setSellerEmail(e.target.value)}
              placeholder="optional"
            />
          </div>
          <div className="min-w-[10rem] space-y-1">
            <label className="text-xs text-muted-foreground">Campaign</label>
            <AppReactSelect
              className="min-w-40 w-full"
              options={campaignOptions}
              value={stringSelectValue(campaignOptions, campaignId)}
              onChange={(opt) =>
                setCampaignId(opt?.value ? String(opt.value) : "")
              }
              isSearchable={campaigns.length > 8}
              aria-label="Campaign"
            />
          </div>
          <div className="min-w-[12rem] space-y-1">
            <label className="text-xs text-muted-foreground">
              Creator list (optional)
            </label>
            <AppReactSelect
              className="min-w-48 w-full"
              options={listOptions}
              value={stringSelectValue(listOptions, listId)}
              onChange={(opt) => {
                const next = opt?.value ? String(opt.value) : "";
                setListId(next);
                if (next) setSelectedCreatorIds(new Set());
              }}
              isSearchable={(listsQuery.data?.lists?.length ?? 0) > 8}
              aria-label="Creator list"
            />
          </div>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={hasFreeSample}
              onChange={(e) => setHasFreeSample(e.target.checked)}
            />
            Free sample
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">
                Products ({selectedProductIds.size} selected)
              </h2>
              {productsQuery.isFetching ? (
                <span className="text-xs text-muted-foreground">Loading…</span>
              ) : null}
            </div>
            {productsQuery.isError ? (
              <p className="text-sm text-destructive" role="alert">
                {productsQuery.error instanceof Error
                  ? productsQuery.error.message
                  : "Failed to load products"}
              </p>
            ) : null}
            <ul className="max-h-56 space-y-1 overflow-y-auto rounded-md border border-border p-2 text-sm">
              {products.length === 0 ? (
                <li className="text-muted-foreground">
                  No active products — authorize shop and list catalog.
                </li>
              ) : (
                products.map((p) => (
                  <li key={p.id}>
                    <label className="flex cursor-pointer items-start gap-2">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={selectedProductIds.has(p.id)}
                        onChange={() => toggleProduct(p.id)}
                      />
                      <span>
                        <span className="font-medium">
                          {p.title || p.id}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {p.id}
                        </span>
                      </span>
                    </label>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-medium">
                {listId
                  ? "Creators (using list — manual pick ignored)"
                  : `Creators (${selectedCreatorIds.size} selected)`}
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedCreatorIds(new Set(withOpenId.map((c) => c.id)))
                }
                disabled={withOpenId.length === 0 || Boolean(listId)}
              >
                Select with open_id ({withOpenId.length})
              </Button>
            </div>
            <ul className="max-h-56 space-y-1 overflow-y-auto rounded-md border border-border p-2 text-sm">
              {creators.length === 0 ? (
                <li className="text-muted-foreground">No CRM creators yet.</li>
              ) : (
                creators.map((c) => (
                  <li key={c.id}>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCreatorIds.has(c.id)}
                        onChange={() => toggleCreator(c.id)}
                        disabled={!c.creatorOpenId || Boolean(listId)}
                      />
                      <span className={!c.creatorOpenId ? "opacity-50" : ""}>
                        @{c.handle}
                        {c.displayName ? ` · ${c.displayName}` : ""}
                      </span>
                      {c.creatorOpenId ? (
                        <Badge variant="secondary" className="text-[10px]">
                          open_id
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          no open_id
                        </Badge>
                      )}
                    </label>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <Button type="submit" disabled={createInvite.isPending || !activeShopId}>
          {createInvite.isPending ? "Sending…" : "Queue TikTok invite"}
        </Button>
      </form>

      <div className="space-y-2">
        <h2 className="text-sm font-medium">Recent invites</h2>
        {invitesQuery.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : invites.length === 0 ? (
          <p className="text-sm text-muted-foreground">No invites yet.</p>
        ) : (
          <ul className="divide-y divide-border rounded-md border border-border">
            {invites.map((inv) => (
              <li
                key={inv.id}
                className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-medium">{inv.name}</span>
                  <span className="ml-2 text-muted-foreground">
                    {inv.shopDisplayName || inv.shopId} ·{" "}
                    {inv.recipients.length} creators
                  </span>
                  {inv.externalCollaborationId ? (
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      TikTok id: {inv.externalCollaborationId}
                    </span>
                  ) : null}
                  {inv.lastError ? (
                    <span className="mt-0.5 block text-xs text-destructive">
                      {inv.lastError}
                    </span>
                  ) : null}
                </div>
                <Badge
                  variant={
                    inv.status === "SENT"
                      ? "default"
                      : inv.status === "FAILED"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {inv.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
