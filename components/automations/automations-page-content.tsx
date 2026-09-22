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
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Automations</h1>
        <p className="text-sm text-muted-foreground">
          Queue multi-step outreach: email first, then TikTok affiliate invite
          via workers (with optional delay).
        </p>
      </div>

      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="min-w-[12rem] flex-1 space-y-1">
            <label className="text-xs text-muted-foreground">Run name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
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
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeEmail}
              onChange={(e) => setIncludeEmail(e.target.checked)}
            />
            Step 1: Email
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeInvite}
              onChange={(e) => setIncludeInvite(e.target.checked)}
            />
            Step 2: TikTok invite
          </label>
        </div>

        {includeEmail ? (
          <div className="min-w-[12rem] max-w-md space-y-1">
            <label className="text-xs text-muted-foreground">
              Email template
            </label>
            <AppReactSelect
              className="min-w-48 w-full"
              options={templateOptions}
              value={stringSelectValue(templateOptions, templateId)}
              onChange={(opt) =>
                setTemplateId(opt?.value ? String(opt.value) : "")
              }
              isSearchable={templates.length > 8}
              aria-label="Email template"
            />
          </div>
        ) : null}

        {includeInvite ? (
          <div className="space-y-3 rounded-md border border-border p-3">
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
                <label className="text-xs text-muted-foreground">
                  Invite name
                </label>
                <Input
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Automation collab"
                />
              </div>
              <div className="min-w-[6rem] space-y-1">
                <label className="text-xs text-muted-foreground">
                  Delay after email (min)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={inviteDelay}
                  onChange={(e) => setInviteDelay(e.target.value)}
                  disabled={!includeEmail}
                />
              </div>
              <div className="min-w-[6rem] space-y-1">
                <label className="text-xs text-muted-foreground">
                  Commission %
                </label>
                <Input
                  type="number"
                  min={10}
                  max={80}
                  value={commissionPercent}
                  onChange={(e) => setCommissionPercent(e.target.value)}
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
            </div>
            <Input
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              placeholder="Invite message"
            />
            <ul className="max-h-40 space-y-1 overflow-y-auto text-sm">
              {products.map((p) => (
                <li key={p.id}>
                  <label className="flex cursor-pointer gap-2">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.has(p.id)}
                      onChange={() => toggleProduct(p.id)}
                    />
                    {p.title || p.id}
                  </label>
                </li>
              ))}
              {products.length === 0 ? (
                <li className="text-muted-foreground">No products loaded.</li>
              ) : null}
            </ul>
          </div>
        ) : null}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">
              Creators ({selectedCreatorIds.size})
            </h2>
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
          </div>
          <ul className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-border p-2 text-sm">
            {creators.map((c) => (
              <li key={c.id}>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCreatorIds.has(c.id)}
                    onChange={() => toggleCreator(c.id)}
                  />
                  @{c.handle}
                  {c.contactEmail ? (
                    <Badge variant="secondary" className="text-[10px]">
                      email
                    </Badge>
                  ) : null}
                  {c.creatorOpenId ? (
                    <Badge variant="secondary" className="text-[10px]">
                      open_id
                    </Badge>
                  ) : null}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <Button type="submit" disabled={createRun.isPending}>
          {createRun.isPending ? "Queueing…" : "Queue automation"}
        </Button>
      </form>

      <div className="space-y-2">
        <h2 className="text-sm font-medium">Recent runs</h2>
        {runsQuery.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : runs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No runs yet.</p>
        ) : (
          <ul className="divide-y divide-border rounded-md border border-border">
            {runs.map((run) => (
              <li key={run.id} className="space-y-1 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{run.name}</span>
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
      </div>
    </div>
  );
}
