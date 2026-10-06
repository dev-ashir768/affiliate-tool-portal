"use client";

import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/use-me";
import { useOrg, usePatchOrg } from "@/hooks/use-org";
import {
  patchCurrentOrgSchema,
  type PatchCurrentOrgSchemaType,
} from "@/validations/org.validations";

import { SectionCard } from "@/components/layout/section-card";
export function OrgSettingsForm() {
  const meQuery = useMe();
  const orgQuery = useOrg();
  const patchOrg = usePatchOrg();

  const orgRole = useMemo(() => {
    const me = meQuery.data;
    if (!me?.currentOrganizationId) return null;
    return (
      me.memberships.find(
        (m) => m.organization.id === me.currentOrganizationId,
      )?.role ?? null
    );
  }, [meQuery.data]);

  const hasProductAccess = useMemo(() => {
    const me = meQuery.data;
    if (!me?.currentOrganizationId) return false;
    return (
      me.memberships.find(
        (m) => m.organization.id === me.currentOrganizationId,
      )?.organization.hasProductAccess ?? false
    );
  }, [meQuery.data]);

  const canEditName =
    hasProductAccess && (orgRole === "OWNER" || orgRole === "ADMIN");

  const form = useForm<PatchCurrentOrgSchemaType>({
    resolver: zodResolver(patchCurrentOrgSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (orgQuery.data?.name) {
      form.reset({ name: orgQuery.data.name });
    }
  }, [orgQuery.data?.name, form]);

  const isSubmitting = form.formState.isSubmitting || patchOrg.isPending;
  const formError = form.formState.errors.root;

  async function onSubmit(data: PatchCurrentOrgSchemaType) {
    form.clearErrors("root");
    try {
      await patchOrg.mutateAsync(data);
      toast.success("Organization name updated");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update organization";
      form.setError("root", { message });
      toast.error(message);
    }
  }

  if (orgQuery.isLoading || meQuery.isLoading) {
    return (
      <div className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
        <div className="flex max-w-lg flex-col gap-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    );
  }

  if (orgQuery.isError || !orgQuery.data) {
    return (
      <div className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
        <p className="text-sm font-medium text-foreground">
          Unable to load organization
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {orgQuery.error instanceof Error
            ? orgQuery.error.message
            : "Something went wrong."}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => orgQuery.refetch()}
        >
          Try again
        </Button>
      </div>
    );
  }

  const org = orgQuery.data;

  const limits = [
    { label: "Plan", value: org.plan.name ?? org.plan.code },
    { label: "Subscription", value: org.subscriptionStatus ?? "—" },
    { label: "Seat limit", value: String(org.seatLimit) },
    { label: "Shop limit", value: String(org.shopLimit) },
    { label: "Bot limit", value: String(org.botLimit) },
    { label: "Daily invite quota", value: String(org.dailyInviteQuota) },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SectionCard
        title="Organization"
        description="Your organization's display name across Tiksly."
        footer={
          canEditName ? (
            <Button
              type="submit"
              form="org-settings-form"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          ) : undefined
        }
      >
        <form
          id="org-settings-form"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Organization name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    disabled={!canEditName || isSubmitting}
                    readOnly={!canEditName}
                    className={!canEditName ? "bg-muted/40" : undefined}
                    autoComplete="organization"
                    type="text"
                    placeholder="Organization name"
                  />
                  {!hasProductAccess ? (
                    <FieldDescription>
                      Choose a plan on onboarding or billing before changing
                      organization settings.
                    </FieldDescription>
                  ) : !canEditName ? (
                    <FieldDescription>
                      Only owners and admins can change the organization name.
                    </FieldDescription>
                  ) : null}
                  {fieldState.error ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
            {formError ? <FieldError errors={[formError]} /> : null}
          </FieldGroup>
        </form>
      </SectionCard>

      <SectionCard
        title="Plan & limits"
        description="Set by your subscription. Change plans from Billing."
      >
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border">
          {limits.map((l) => (
            <div key={l.label} className="bg-card px-4 py-3">
              <dt className="text-xs text-muted-foreground">{l.label}</dt>
              <dd className="mt-0.5 truncate text-sm font-medium">{l.value}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>
    </div>
  );
}
