"use client";

import { useMemo, useState } from "react";
import {
  BotIcon,
  CheckIcon,
  CopyIcon,
  ShieldCheckIcon,
  StoreIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMe } from "@/hooks/use-me";
import { useConnectShop } from "@/hooks/use-shops";
import { ShopsApiError } from "@/services/shops";
import type { Shop } from "@/types/shops";
import { cn } from "cn";

type Region = "US" | "UK";
type Step = "choose" | "bot-done";

type ConnectShopDialogProps = {
  disabled?: boolean;
  disabledReason?: string | null;
  oauthAvailable: boolean;
  oauthPending?: boolean;
  onOauthConnect: (region: Region) => Promise<void>;
  onPlanLimit?: () => void;
  /** Self-serve bot shops continue in the bot setup dialog. */
  onBotShopCreated?: (shop: Shop) => void;
};

function MethodCard({
  icon,
  title,
  badge,
  description,
  disabled,
  busy,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  badge?: React.ReactNode;
  description: string;
  disabled?: boolean;
  busy?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled || busy}
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border border-border p-4 text-left transition-colors",
        "hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:border-border disabled:hover:bg-transparent",
      )}
    >
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
        {icon}
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-2 text-sm font-medium">
          {busy ? "Starting…" : title}
          {badge}
        </span>
        <span className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
    </button>
  );
}

export function ConnectShopDialog({
  disabled,
  disabledReason,
  oauthAvailable,
  oauthPending,
  onOauthConnect,
  onPlanLimit,
  onBotShopCreated,
}: ConnectShopDialogProps) {
  const { data: me } = useMe();
  const connect = useConnectShop();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("choose");
  const [region, setRegion] = useState<Region>("US");
  const [botEmail, setBotEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canConnect = useMemo(() => {
    if (!me?.currentOrganizationId) return false;
    const role = me.memberships.find(
      (m) => m.organization.id === me.currentOrganizationId,
    )?.role;
    return role === "OWNER" || role === "ADMIN";
  }, [me]);

  if (!canConnect) return null;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setStep("choose");
      setBotEmail(null);
      setError(null);
      setCopied(false);
    }
  }

  async function connectViaOauth() {
    setError(null);
    try {
      await onOauthConnect(region);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start TikTok authorization");
    }
  }

  async function connectViaBot() {
    setError(null);
    try {
      const shop = await connect.mutateAsync({ region });
      if (shop.botSelfServe && onBotShopCreated) {
        handleOpenChange(false);
        onBotShopCreated(shop);
        return;
      }
      setBotEmail(shop.botEmail);
      setStep("bot-done");
      toast.success("Shop created — invite the bot email in Seller Center");
    } catch (err) {
      if (err instanceof ShopsApiError && err.code === "PLAN_LIMIT") {
        onPlanLimit?.();
        setError("Shop limit reached. Upgrade your plan to connect more shops.");
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to connect shop");
    }
  }

  async function copyBotEmail(email: string) {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success("Bot email copied");
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy email");
    }
  }

  const busy = connect.isPending || Boolean(oauthPending);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button type="button" size="lg" disabled={disabled || !me} />}>
        <StoreIcon data-icon="inline-start" />
        Connect shop
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {step === "choose" ? (
          <>
            <DialogHeader>
              <DialogTitle>Connect a TikTok Shop</DialogTitle>
              <DialogDescription>
                Choose how influxa should connect to your shop.
                {disabledReason ? ` ${disabledReason}` : null}
              </DialogDescription>
            </DialogHeader>

            <Field>
              <FieldLabel htmlFor="connect-region">Shop region</FieldLabel>
              <Select
                value={region}
                onValueChange={(v) => {
                  if (v === "US" || v === "UK") setRegion(v);
                }}
                disabled={busy}
              >
                <SelectTrigger id="connect-region" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="flex flex-col gap-3">
              <MethodCard
                icon={<ShieldCheckIcon className="size-4" />}
                title="Authorize with TikTok"
                badge={
                  oauthAvailable ? (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      Recommended
                    </span>
                  ) : (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      Coming soon
                    </span>
                  )
                }
                description="Sign in to TikTok Seller Center and approve access. Official, secure, and syncs orders and products automatically."
                disabled={!oauthAvailable || disabled}
                busy={Boolean(oauthPending)}
                onClick={() => void connectViaOauth()}
              />
              <MethodCard
                icon={<BotIcon className="size-4" />}
                title="Connect with a bot collaborator"
                description="We give you a bot email. You invite it as a collaborator in Seller Center, then click Verify. No TikTok app approval needed."
                disabled={disabled}
                busy={connect.isPending}
                onClick={() => void connectViaBot()}
              />
            </div>

            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Invite your bot</DialogTitle>
              <DialogDescription>
                Finish the connection in TikTok Seller Center.
              </DialogDescription>
            </DialogHeader>

            {botEmail ? (
              <div className="flex flex-col gap-2">
                <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 font-mono text-sm break-all">
                  {botEmail}
                </p>
                <Button type="button" variant="outline" onClick={() => void copyBotEmail(botEmail)}>
                  {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
                  {copied ? "Copied" : "Copy bot email"}
                </Button>
              </div>
            ) : null}

            <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm text-muted-foreground">
              <li>Open TikTok Seller Center → Account → User management.</li>
              <li>Invite the bot email above as a collaborator.</li>
              <li>
                Come back here and click <span className="font-medium text-foreground">Verify</span> on the shop.
              </li>
            </ol>
          </>
        )}

        <DialogFooter>
          {step === "bot-done" ? (
            <Button type="button" onClick={() => handleOpenChange(false)}>
              Done
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={busy}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
