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

import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CheckboxLabel } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/layout/page-header";
import { FormGrid, SectionCard } from "@/components/layout/section-card";
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
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-14 w-full max-w-md" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const products = productsQuery.data?.products ?? [];
  const invites = invitesQuery.data?.invites ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Affiliate invites"
        description={
          <>
            Create TikTok Shop target collaborations — private product
            invites with commission. Creators need a{" "}
            <code className="rounded bg-muted px-1 text-xs">creatorOpenId</code>{" "}
            from Discover sync.
          </>
        }
      />

      <form
        onSubmit={(e) => void onSubmit(e)}
        className="flex flex-col gap-6"
      >
        <SectionCard
          title="Invite details"
          description="Shop, terms and the message creators will see."
        >
          <div className="flex flex-col gap-5">
            <FormGrid columns={3}>
              <Field>
                <FieldLabel>Shop</FieldLabel>
                <AppReactSelect
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
              </Field>
              <Field>
                <FieldLabel htmlFor="invite-name">Invite name</FieldLabel>
                <Input
                  id="invite-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Spring collab"
                />
              </Field>
              <Field>
                <FieldLabel>Campaign</FieldLabel>
                <AppReactSelect
                  options={campaignOptions}
                  value={stringSelectValue(campaignOptions, campaignId)}
                  onChange={(opt) =>
                    setCampaignId(opt?.value ? String(opt.value) : "")
                  }
                  isSearchable={campaigns.length > 8}
                  aria-label="Campaign"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="invite-end">Ends</FieldLabel>
                <Input
                  id="invite-end"
                  type="datetime-local"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="invite-commission">Commission %</FieldLabel>
                <Input
                  id="invite-commission"
                  type="number"
                  min={10}
                  max={80}
                  step={0.01}
                  value={commissionPercent}
                  onChange={(e) => setCommissionPercent(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="invite-seller-email">
                  Seller contact email
                </FieldLabel>
                <Input
                  id="invite-seller-email"
                  type="email"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  placeholder="Optional"
                />
              </Field>
            </FormGrid>
            <Field>
              <FieldLabel htmlFor="invite-message">Message to creators</FieldLabel>
              <Textarea
                id="invite-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </Field>
            <CheckboxLabel
              checked={hasFreeSample}
              onChange={(e) => setHasFreeSample(e.target.checked)}
            >
              Offer a free sample
            </CheckboxLabel>
          </div>
        </SectionCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            title={`Products (${selectedProductIds.size} selected)`}
            description="Active products from the selected shop."
            actions={
              productsQuery.isFetching ? (
                <span className="text-xs text-muted-foreground">Loading…</span>
              ) : undefined
            }
          >
            {productsQuery.isError ? (
              <p className="mb-3 text-sm text-destructive" role="alert">
                {productsQuery.error instanceof Error
                  ? productsQuery.error.message
                  : "Failed to load products"}
              </p>
            ) : null}
            <div className="max-h-72 overflow-y-auto rounded-lg border">
              {products.length === 0 ? (
                <p className="px-3 py-4 text-sm text-muted-foreground">
                  No active products — authorize the shop and list its catalog.
                </p>
              ) : (
                <ul className="divide-y">
                  {products.map((p) => (
                    <li key={p.id} className="px-3 py-2">
                      <CheckboxLabel
                        checked={selectedProductIds.has(p.id)}
                        onChange={() => toggleProduct(p.id)}
                      >
                        <span className="block truncate font-medium">
                          {p.title || p.id}
                        </span>
                        <span className="block truncate font-mono text-xs text-muted-foreground">
                          {p.id}
                        </span>
                      </CheckboxLabel>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title={
              listId
                ? "Creators (from list)"
                : `Creators (${selectedCreatorIds.size} selected)`
            }
            description={
              listId
                ? "Sending to the selected list — manual picks are ignored."
                : "Only creators with an open_id can be invited."
            }
          >
            <div className="flex flex-col gap-4">
              <Field>
                <FieldLabel>Creator list (optional)</FieldLabel>
                <AppReactSelect
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
              </Field>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Pick creators</span>
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
              <div className="max-h-56 overflow-y-auto rounded-lg border">
                {creators.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-muted-foreground">
                    No CRM creators yet.
                  </p>
                ) : (
                  <ul className="divide-y">
                    {creators.map((c) => (
                      <li key={c.id} className="px-3 py-2">
                        <CheckboxLabel
                          checked={selectedCreatorIds.has(c.id)}
                          onChange={() => toggleCreator(c.id)}
                          disabled={!c.creatorOpenId || Boolean(listId)}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span
                              className={!c.creatorOpenId ? "opacity-50" : ""}
                            >
                              @{c.handle}
                              {c.displayName ? ` · ${c.displayName}` : ""}
                            </span>
                            {c.creatorOpenId ? (
                              <Badge variant="secondary">open_id</Badge>
                            ) : (
                              <Badge variant="outline">no open_id</Badge>
                            )}
                          </span>
                        </CheckboxLabel>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={createInvite.isPending || !activeShopId}
          >
            {createInvite.isPending ? "Sending…" : "Queue TikTok invite"}
          </Button>
        </div>
      </form>

      <SectionCard
        title="Recent invites"
        description="Latest target collaborations and their delivery status."
        contentClassName="px-0"
      >
        {invitesQuery.isLoading ? (
          <div className="px-4">
            <Skeleton className="h-24 w-full" />
          </div>
        ) : invites.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            No invites yet.
          </p>
        ) : (
          <ul className="divide-y">
            {invites.map((inv) => (
              <li
                key={inv.id}
                className="flex flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{inv.name}</p>
                  <p className="text-muted-foreground">
                    {inv.shopDisplayName || inv.shopId} ·{" "}
                    {inv.recipients.length} creators
                  </p>
                  {inv.externalCollaborationId ? (
                    <p className="text-xs text-muted-foreground">
                      TikTok id: {inv.externalCollaborationId}
                    </p>
                  ) : null}
                  {inv.lastError ? (
                    <p className="text-xs text-destructive">{inv.lastError}</p>
                  ) : null}
                </div>
                <Badge
                  className="self-start sm:self-center"
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
      </SectionCard>
    </div>
  );
}
