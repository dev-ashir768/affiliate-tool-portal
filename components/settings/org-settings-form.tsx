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

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Input value={value} readOnly disabled className="bg-muted/40" />
    </Field>
  );
}

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

  const canEditName = orgRole === "OWNER" || orgRole === "ADMIN";

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
      <div className="rounded-lg border border-border bg-card p-6">
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
      <div className="rounded-lg border border-border bg-card p-6">
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

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <form
        id="org-settings-form"
        noValidate
        className="max-w-lg"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Organization name</FieldLabel>
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
                {!canEditName ? (
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

          <ReadOnlyField label="Plan" value={org.plan.code} />
          <ReadOnlyField label="Seat limit" value={String(org.seatLimit)} />
          <ReadOnlyField label="Shop limit" value={String(org.shopLimit)} />
          <ReadOnlyField label="Bot limit" value={String(org.botLimit)} />
          <ReadOnlyField
            label="Daily invite quota"
            value={String(org.dailyInviteQuota)}
          />
          <ReadOnlyField
            label="Subscription status"
            value={org.subscriptionStatus ?? "—"}
          />

          {formError ? <FieldError errors={[formError]} /> : null}

          {canEditName ? (
            <Field>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </Field>
          ) : null}
        </FieldGroup>
      </form>
    </div>
  );
}
