"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  useCampaigns,
  useCreators,
  useOutreachTemplates,
} from "@/hooks/use-creators";
import { useShops } from "@/hooks/use-shops";
import { useInviteProducts } from "@/hooks/use-invites";
import {
  useAutomationRuns,
  useCreateAutomationRun,
} from "@/hooks/use-automations";
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

export function AutomationsPageContent() {
  const runsQuery = useAutomationRuns();
  const creatorsQuery = useCreators();
  const templatesQuery = useOutreachTemplates();
  const campaignsQuery = useCampaigns();
  const shopsQuery = useShops();
  const createRun = useCreateAutomationRun();

  const oauthShops = useMemo(
    () =>
      (shopsQuery.data?.shops ?? []).filter((s) => Boolean(s.oauthConnected)),
    [shopsQuery.data?.shops],
  );

  const [name, setName] = useState("Email then invite");
  const [campaignId, setCampaignId] = useState("");
  const [shopId, setShopId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [inviteDelay, setInviteDelay] = useState("0");
  const [inviteName, setInviteName] = useState("");
  const [inviteMessage, setInviteMessage] = useState(
    "Exclusive collab invite — check your TikTok Shop affiliate inbox.",
  );
  const [endAt, setEndAt] = useState(defaultEndAt);
  const [commissionPercent, setCommissionPercent] = useState("15");
  const [includeInvite, setIncludeInvite] = useState(true);
  const [includeEmail, setIncludeEmail] = useState(true);
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set(),
  );

  const activeShopId = shopId || oauthShops[0]?.id || null;
  const productsQuery = useInviteProducts(
    includeInvite ? activeShopId : null,
  );

  const creators = creatorsQuery.data?.creators ?? [];
  const templates = useMemo(
    () => templatesQuery.data?.templates ?? [],
    [templatesQuery.data?.templates],
  );
  const campaigns = useMemo(
    () => campaignsQuery.data?.campaigns ?? [],
    [campaignsQuery.data?.campaigns],
  );
  const products = productsQuery.data?.products ?? [];
  const runs = runsQuery.data?.runs ?? [];

  const campaignOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "None" },
      ...campaigns.map((c) => ({ value: c.id, label: c.name })),
    ],
    [campaigns],
  );

  const templateOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "Select template" },
      ...templates.map((t) => ({ value: t.id, label: t.name })),
    ],
    [templates],
  );

  const shopOptions: SelectOption[] = useMemo(() => {
    if (oauthShops.length === 0) {
      return [{ value: "", label: "No OAuth shop" }];
    }
    return oauthShops.map((s) => ({
      value: s.id,
      label: s.displayName || s.id,
    }));
  }, [oauthShops]);

  function toggleCreator(id: string) {
    setSelectedCreatorIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleProduct(id: string) {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!includeEmail && !includeInvite) {
      toast.error("Enable at least one step");
      return;
    }
    if (selectedCreatorIds.size === 0) {
      toast.error("Select creators");
      return;
    }
    if (includeEmail && !templateId) {
      toast.error("Pick an email template");
      return;
    }
    if (includeInvite) {
      if (!activeShopId) {
        toast.error("OAuth shop required for invite step");
        return;
      }
      if (!inviteName.trim()) {
        toast.error("Invite name required");
        return;
      }
      if (selectedProductIds.size === 0) {
        toast.error("Select products for invite step");
        return;
      }
    }

    const pct = Number(commissionPercent);
    const delayMinutes = Math.max(0, Number(inviteDelay) || 0);

    const steps: Parameters<typeof createRun.mutateAsync>[0]["steps"] = [];
    if (includeEmail) {
      steps.push({
        kind: "EMAIL",
        delayMinutes: 0,
        templateId,
      });
    }
    if (includeInvite) {
      steps.push({
        kind: "AFFILIATE_INVITE",
        delayMinutes: includeEmail ? delayMinutes : 0,
        inviteName: inviteName.trim() || name.trim(),
        message: inviteMessage.trim() || null,
        endAt: new Date(endAt).toISOString(),
        products: [...selectedProductIds].map((id) => ({
          id,
          commissionPercent: Number.isFinite(pct) ? pct : 15,
        })),
      });
    }

    try {
      const result = await createRun.mutateAsync({
        name: name.trim(),
        campaignId: campaignId || null,
        shopId: includeInvite ? activeShopId : null,
        creatorIds: [...selectedCreatorIds],
        steps,
      });
      toast.success(`Automation queued (${result.run.steps.length} steps)`);
      setSelectedCreatorIds(new Set());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start");
    }
  }

  if (creatorsQuery.isLoading || shopsQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-14 w-full max-w-md" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 w-full lg:col-span-2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Automations"
        description="Queue multi-step outreach: email first, then a TikTok affiliate invite via workers (with an optional delay)."
      />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <form
          onSubmit={(e) => void onSubmit(e)}
          className="flex flex-col gap-6 lg:col-span-2"
        >
          <SectionCard
            title="Run details"
            description="Name the run, pick a campaign and choose which steps to queue."
          >
            <div className="flex flex-col gap-5">
              <FormGrid columns={2}>
                <Field>
                  <FieldLabel htmlFor="automation-name">Run name</FieldLabel>
                  <Input
                    id="automation-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
              </FormGrid>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <CheckboxLabel
                  checked={includeEmail}
                  onChange={(e) => setIncludeEmail(e.target.checked)}
                >
                  Step 1 · Email
                </CheckboxLabel>
                <CheckboxLabel
                  checked={includeInvite}
                  onChange={(e) => setIncludeInvite(e.target.checked)}
                >
                  Step 2 · TikTok invite
                </CheckboxLabel>
              </div>
            </div>
          </SectionCard>

          {includeEmail ? (
            <SectionCard
              title="Step 1 · Email"
              description="Template sent to creators with a contact email."
            >
              <FormGrid columns={2}>
                <Field>
                  <FieldLabel>Email template</FieldLabel>
                  <AppReactSelect
                    options={templateOptions}
                    value={stringSelectValue(templateOptions, templateId)}
                    onChange={(opt) =>
                      setTemplateId(opt?.value ? String(opt.value) : "")
                    }
                    isSearchable={templates.length > 8}
                    aria-label="Email template"
                  />
                </Field>
              </FormGrid>
            </SectionCard>
          ) : null}

          {includeInvite ? (
            <SectionCard
              title="Step 2 · TikTok invite"
              description="Target collaboration invite sent from an authorized shop."
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
                    <FieldLabel htmlFor="automation-invite-name">
                      Invite name
                    </FieldLabel>
                    <Input
                      id="automation-invite-name"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="Automation collab"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="automation-end">Ends</FieldLabel>
                    <Input
                      id="automation-end"
                      type="datetime-local"
                      value={endAt}
                      onChange={(e) => setEndAt(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="automation-commission">
                      Commission %
                    </FieldLabel>
                    <Input
                      id="automation-commission"
                      type="number"
                      min={10}
                      max={80}
                      value={commissionPercent}
                      onChange={(e) => setCommissionPercent(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="automation-delay">
                      Delay after email (min)
                    </FieldLabel>
                    <Input
                      id="automation-delay"
                      type="number"
                      min={0}
                      value={inviteDelay}
                      onChange={(e) => setInviteDelay(e.target.value)}
                      disabled={!includeEmail}
                    />
                  </Field>
                </FormGrid>
                <Field>
                  <FieldLabel htmlFor="automation-message">
                    Invite message
                  </FieldLabel>
                  <Textarea
                    id="automation-message"
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    placeholder="Message shown to creators with the invite"
                    rows={3}
                  />
                </Field>
                <Field>
                  <FieldLabel>
                    Products ({selectedProductIds.size} selected)
                  </FieldLabel>
                  <div className="max-h-48 overflow-y-auto rounded-lg border">
                    {products.length === 0 ? (
                      <p className="px-3 py-4 text-sm text-muted-foreground">
                        No products loaded for this shop.
                      </p>
                    ) : (
                      <ul className="divide-y">
                        {products.map((p) => (
                          <li key={p.id} className="px-3 py-2">
                            <CheckboxLabel
                              checked={selectedProductIds.has(p.id)}
                              onChange={() => toggleProduct(p.id)}
                            >
                              <span className="truncate">{p.title || p.id}</span>
                            </CheckboxLabel>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Field>
              </div>
            </SectionCard>
          ) : null}

          <SectionCard
            title={`Creators (${selectedCreatorIds.size} selected)`}
            description="Creators included in this run."
            actions={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedCreatorIds(new Set(creators.map((c) => c.id)))
                }
              >
                Select all
              </Button>
            }
            footer={
              <Button type="submit" size="lg" disabled={createRun.isPending}>
                {createRun.isPending ? "Queueing…" : "Queue automation"}
              </Button>
            }
          >
            <div className="max-h-64 overflow-y-auto rounded-lg border">
              {creators.length === 0 ? (
                <p className="px-3 py-4 text-sm text-muted-foreground">
                  No creators in your CRM yet.
                </p>
              ) : (
                <ul className="divide-y">
                  {creators.map((c) => (
                    <li key={c.id} className="px-3 py-2">
                      <CheckboxLabel
                        checked={selectedCreatorIds.has(c.id)}
                        onChange={() => toggleCreator(c.id)}
                      >
                        <span className="inline-flex items-center gap-2">
                          @{c.handle}
                          {c.contactEmail ? (
                            <Badge variant="secondary">email</Badge>
                          ) : null}
                          {c.creatorOpenId ? (
                            <Badge variant="secondary">open_id</Badge>
                          ) : null}
                        </span>
                      </CheckboxLabel>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </SectionCard>
        </form>

        <SectionCard
          title="Recent runs"
          description="Latest queued automations and their step status."
          contentClassName="px-0"
        >
          {runsQuery.isLoading ? (
            <div className="px-4">
              <Skeleton className="h-24 w-full" />
            </div>
          ) : runs.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No runs yet.
            </p>
          ) : (
            <ul className="divide-y">
              {runs.map((run) => (
                <li key={run.id} className="space-y-1 px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">{run.name}</span>
                    <Badge
                      variant={
                        run.status === "COMPLETED"
                          ? "default"
                          : run.status === "FAILED"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {run.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {run.creatorIds.length} creators ·{" "}
                    {run.steps
                      .map((s) => `${s.kind}:${s.status}`)
                      .join(" → ")}
                  </p>
                  {run.lastError ? (
                    <p className="text-xs text-destructive">{run.lastError}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
