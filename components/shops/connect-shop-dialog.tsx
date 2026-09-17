"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoreIcon } from "lucide-react";
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
    }
  }

  async function onSubmit(data: ConnectShopSchemaType) {
    form.clearErrors("root");
    try {
      await connect.mutateAsync(data);
      handleOpenChange(false);
    } catch (err) {
      if (err instanceof ShopsApiError && err.code === "PLAN_LIMIT") {
        onPlanLimit?.();
        form.setError("root", {
          message:
            "Shop limit reached. Upgrade your plan to connect more shops.",
        });
        return;
      }
      form.setError("root", {
        message: err instanceof Error ? err.message : "Failed to connect shop",
      });
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
          <DialogTitle>Connect a shop</DialogTitle>
          <DialogDescription>
            Reserve a bot identity for TikTok Shop in the selected region.
            {disabledReason ? ` ${disabledReason}` : null}
          </DialogDescription>
        </DialogHeader>
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
        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
