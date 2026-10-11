"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SectionCard } from "@/components/layout/section-card";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useRegenerateBackupCodes,
  useRevokeTrustedDevice,
  useTwoFactorStatus,
} from "@/hooks/use-two-factor";
import {
  regenerateBackupCodesSchema,
  type RegenerateBackupCodesSchemaType,
} from "@/validations/auth.validations";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function RegenerateBackupCodesDialog() {
  const regenerate = useRegenerateBackupCodes();
  const [open, setOpen] = useState(false);
  const [newCodes, setNewCodes] = useState<string[] | null>(null);

  const form = useForm<RegenerateBackupCodesSchemaType>({
    resolver: zodResolver(regenerateBackupCodesSchema),
    defaultValues: { code: "" },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      form.reset({ code: "" });
      form.clearErrors();
      setNewCodes(null);
    }
  }

  async function onSubmit(data: RegenerateBackupCodesSchemaType) {
    form.clearErrors("root");
    try {
      const result = await regenerate.mutateAsync(data.code);
      setNewCodes(result.backupCodes);
      toast.success("New backup codes generated");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to regenerate codes";
      form.setError("root", { message });
      toast.error(message);
    }
  }

  async function copyCodes() {
    if (!newCodes) return;
    try {
      await navigator.clipboard.writeText(newCodes.join("\n"));
      toast.success("Backup codes copied");
    } catch {
      toast.error("Could not copy codes");
    }
  }

  const isSubmitting = form.formState.isSubmitting || regenerate.isPending;
  const formError = form.formState.errors.root;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button type="button" variant="outline" />}>
        Regenerate backup codes
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {newCodes ? "Save your new backup codes" : "Regenerate backup codes"}
          </DialogTitle>
          <DialogDescription>
            {newCodes
              ? "Each code works once. Your previous backup codes no longer work. They will not be shown again."
              : "Enter a code from your authenticator app. Existing backup codes will be invalidated."}
          </DialogDescription>
        </DialogHeader>
        {newCodes ? (
          <>
            <ul className="grid grid-cols-2 gap-2 rounded-lg border bg-muted/40 p-3 font-mono text-sm">
              {newCodes.map((code) => (
                <li key={code}>{code}</li>
              ))}
            </ul>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={copyCodes}>
                Copy codes
              </Button>
              <Button type="button" onClick={() => handleOpenChange(false)}>
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <form
              id="regenerate-backup-codes-form"
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <Controller
                  name="code"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="regenerate-totp-code">
                        Authenticator code
                      </FieldLabel>
                      <Input
                        {...field}
                        id="regenerate-totp-code"
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="123456"
                        disabled={isSubmitting}
                      />
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
                form="regenerate-backup-codes-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Generating…" : "Regenerate"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function TwoFactorSettings() {
  const statusQuery = useTwoFactorStatus();
  const revoke = useRevokeTrustedDevice();
  const [revokingId, setRevokingId] = useState<string | null>(null);

  async function onRevoke(id: string) {
    setRevokingId(id);
    try {
      await revoke.mutateAsync(id);
      toast.success("Trusted device revoked");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to revoke device");
    } finally {
      setRevokingId(null);
    }
  }

  if (statusQuery.isLoading) {
    return (
      <SectionCard title="Two-factor authentication">
        <div className="flex max-w-lg flex-col gap-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-full" />
        </div>
      </SectionCard>
    );
  }

  if (statusQuery.isError || !statusQuery.data) {
    return (
      <SectionCard
        title="Two-factor authentication"
        description="Unable to load your two-factor status."
      >
        <p className="text-sm text-muted-foreground">
          {statusQuery.error instanceof Error
            ? statusQuery.error.message
            : "Something went wrong."}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => void statusQuery.refetch()}
        >
          Try again
        </Button>
      </SectionCard>
    );
  }

  const status = statusQuery.data;

  return (
    <SectionCard
      title="Two-factor authentication"
      description="Protect your account with an authenticator app. Two-factor is required and cannot be turned off."
      actions={
        <Badge variant="outline" className="rounded-full">
          {status.enabled ? "Enabled" : "Not enabled"}
        </Badge>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Backup codes</p>
            <p className="text-sm text-muted-foreground">
              {status.backupCodesRemaining} unused{" "}
              {status.backupCodesRemaining === 1 ? "code" : "codes"} remaining
            </p>
          </div>
          {status.enabled ? <RegenerateBackupCodesDialog /> : null}
        </div>

        <div>
          <p className="text-sm font-medium">Trusted devices</p>
          {status.trustedDevices.length === 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">
              No trusted devices. You will be asked for a code on every sign-in.
            </p>
          ) : (
            <ul className="mt-2 divide-y rounded-lg border">
              {status.trustedDevices.map((device) => (
                <li
                  key={device.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {device.label || "Unnamed device"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Added {dateFormatter.format(new Date(device.createdAt))} ·
                      Expires {dateFormatter.format(new Date(device.expiresAt))}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={revokingId === device.id}
                    onClick={() => void onRevoke(device.id)}
                  >
                    {revokingId === device.id ? "Revoking…" : "Revoke"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
