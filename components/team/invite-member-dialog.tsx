"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon, CopyIcon, UserPlusIcon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMe } from "@/hooks/use-me";
import { createInvite } from "@/services/orgs";
import {
  createInviteSchema,
  type CreateInviteSchemaType,
} from "@/validations/org.validations";

export function InviteMemberDialog() {
  const queryClient = useQueryClient();
  const { data: me, isLoading: meLoading } = useMe();
  const [open, setOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const orgRole = useMemo(() => {
    if (!me?.currentOrganizationId) return null;
    return (
      me.memberships.find(
        (m) => m.organization.id === me.currentOrganizationId,
      )?.role ?? null
    );
  }, [me]);

  const canInvite = orgRole === "OWNER" || orgRole === "ADMIN";

  const form = useForm<CreateInviteSchemaType>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const formError = form.formState.errors.root;

  function resetDialogState() {
    form.reset({ email: "", role: "MEMBER" });
    form.clearErrors();
    setInviteLink(null);
    setCopied(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      resetDialogState();
    }
  }

  async function onSubmit(data: CreateInviteSchemaType) {
    form.clearErrors("root");
    try {
      const result = await createInvite(data);
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      setInviteLink(`${origin}/invite/${result.inviteToken}`);
      void queryClient.invalidateQueries({ queryKey: ["org", "members"] });
    } catch (err) {
      form.setError("root", {
        message: err instanceof Error ? err.message : "Failed to create invite",
      });
    }
  }

  async function handleCopy() {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      form.setError("root", { message: "Unable to copy link" });
    }
  }

  if (meLoading) {
    return (
      <Button type="button" disabled>
        <UserPlusIcon data-icon="inline-start" />
        Invite member
      </Button>
    );
  }

  if (!canInvite) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button type="button" />}>
        <UserPlusIcon data-icon="inline-start" />
        Invite member
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {inviteLink ? "Invite created" : "Invite member"}
          </DialogTitle>
          <DialogDescription>
            {inviteLink
              ? "Copy this link and share it with the invitee. It is shown only once."
              : "Send an invite to join your organization as Admin or Member."}
          </DialogDescription>
        </DialogHeader>

        {inviteLink ? (
          <div className="flex flex-col gap-3">
            <Field>
              <FieldLabel htmlFor="invite-link">Invite link</FieldLabel>
              <div className="flex gap-2">
                <Input
                  id="invite-link"
                  readOnly
                  value={inviteLink}
                  className="font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => void handleCopy()}
                  aria-label={copied ? "Copied" : "Copy invite link"}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </Button>
              </div>
            </Field>
          </div>
        ) : (
          <form
            id="invite-member-form"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="invite-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="invite-email"
                      type="email"
                      autoComplete="email"
                      placeholder="colleague@company.com"
                      aria-invalid={fieldState.invalid || undefined}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="invite-role">Role</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        if (value === "ADMIN" || value === "MEMBER") {
                          field.onChange(value);
                        }
                      }}
                    >
                      <SelectTrigger
                        id="invite-role"
                        className="w-full"
                        aria-invalid={fieldState.invalid || undefined}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {formError && <FieldError errors={[formError]} />}
            </FieldGroup>
          </form>
        )}

        <DialogFooter>
          {inviteLink ? (
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
                form="invite-member-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending…" : "Send invite"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
