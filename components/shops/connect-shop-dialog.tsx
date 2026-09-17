"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, CopyIcon, StoreIcon } from "lucide-react";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
import {
  connectShopSchema,
  type ConnectShopSchemaType,
} from "@/validations/shop.validations";
import { toast } from "sonner";

type ConnectShopDialogProps = {
  disabled?: boolean;
  disabledReason?: string | null;
  onPlanLimit?: () => void;
};

export function ConnectShopDialog({
  disabled,
  disabledReason,
  onPlanLimit,
}: ConnectShopDialogProps) {
  const { data: me } = useMe();
  const connect = useConnectShop();
  const [open, setOpen] = useState(false);
  const [connectedBotEmail, setConnectedBotEmail] = useState<string | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  const orgRole = useMemo(() => {
    if (!me?.currentOrganizationId) return null;
    return (
      me.memberships.find(
        (m) => m.organization.id === me.currentOrganizationId,
      )?.role ?? null
    );
  }, [me]);

  const canConnect = orgRole === "OWNER" || orgRole === "ADMIN";

  const form = useForm<ConnectShopSchemaType>({
    resolver: zodResolver(connectShopSchema),
    defaultValues: { region: "US" },
  });

  if (!canConnect) {
    return null;
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      form.reset({ region: "US" });
      form.clearErrors();
      setConnectedBotEmail(null);
      setCopied(false);
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

  async function onSubmit(data: ConnectShopSchemaType) {
    form.clearErrors("root");
    try {
      const shop = await connect.mutateAsync(data);
      const email = shop.botEmail;
      setConnectedBotEmail(email);
      toast.success(
        email
          ? `Shop connected — invite ${email} in Seller Center`
          : "Shop connect started",
      );
    } catch (err) {
      if (err instanceof ShopsApiError && err.code === "PLAN_LIMIT") {
        onPlanLimit?.();
        const message =
          "Shop limit reached. Upgrade your plan to connect more shops.";
        form.setError("root", { message });
        toast.error(message);
        return;
      }
      const message =
        err instanceof Error ? err.message : "Failed to connect shop";
      form.setError("root", { message });
      toast.error(message);
    }
  }

  const isSubmitting = form.formState.isSubmitting || connect.isPending;
  const formError = form.formState.errors.root;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<Button type="button" disabled={disabled || !me} />}
      >
        <StoreIcon data-icon="inline-start" />
        Connect shop
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {connectedBotEmail ? "Invite your bot" : "Connect a shop"}
          </DialogTitle>
          <DialogDescription>
            {connectedBotEmail
              ? "Send a TikTok Shop collaborator invite to this bot email, then run Verify."
              : "Reserve a bot identity for TikTok Shop in the selected region."}
            {!connectedBotEmail && disabledReason
              ? ` ${disabledReason}`
              : null}
          </DialogDescription>
        </DialogHeader>

        {connectedBotEmail ? (
          <div className="space-y-3">
            <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 font-mono text-sm break-all">
              {connectedBotEmail}
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => void copyBotEmail(connectedBotEmail)}
            >
              {copied ? (
                <CheckIcon data-icon="inline-start" />
              ) : (
                <CopyIcon data-icon="inline-start" />
              )}
              {copied ? "Copied" : "Copy bot email"}
            </Button>
          </div>
        ) : (
          <form
            id="connect-shop-form"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                control={form.control}
                name="region"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="shop-region">Region</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        if (value === "US" || value === "UK") {
                          field.onChange(value);
                        }
                      }}
                      disabled={isSubmitting || disabled}
                    >
                      <SelectTrigger
                        id="shop-region"
                        className="w-full"
                        aria-invalid={fieldState.invalid || undefined}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
              {formError ? <FieldError errors={[formError]} /> : null}
            </FieldGroup>
          </form>
        )}

        <DialogFooter>
          {connectedBotEmail ? (
            <Button type="button" onClick={() => handleOpenChange(false)}>
              Done
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="connect-shop-form"
                disabled={isSubmitting || disabled}
              >
                {isSubmitting ? "Connecting…" : "Connect"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
