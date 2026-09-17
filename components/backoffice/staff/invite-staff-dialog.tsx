"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlusIcon } from "lucide-react";
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
import { useCreatePlatformStaff } from "@/hooks/use-platform";
import {
  createStaffSchema,
  type CreateStaffSchemaType,
} from "@/validations/platform.validations";
import { toast } from "sonner";

export function InviteStaffDialog() {
  const createStaff = useCreatePlatformStaff();
  const [open, setOpen] = useState(false);

  const form = useForm<CreateStaffSchemaType>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      email: "",
      name: "",
      role: "OPS",
      password: "",
    },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      form.reset({ email: "", name: "", role: "OPS", password: "" });
      form.clearErrors();
    }
  }

  async function onSubmit(data: CreateStaffSchemaType) {
    form.clearErrors("root");
    try {
      await createStaff.mutateAsync(data);
      toast.success("Staff member added");
      handleOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create staff";
      form.setError("root", { message });
      toast.error(message);
    }
  }

  const isSubmitting = form.formState.isSubmitting || createStaff.isPending;
  const formError = form.formState.errors.root;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button type="button" />}>
        <UserPlusIcon data-icon="inline-start" />
        Add staff
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add platform staff</DialogTitle>
          <DialogDescription>
            Create a platform user or attach platform access to an existing
            account.
          </DialogDescription>
        </DialogHeader>
        <form
          id="invite-staff-form"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="staff-name">Name</FieldLabel>
                  <Input {...field} id="staff-name" autoComplete="name" />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="staff-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="staff-email"
                    type="email"
                    autoComplete="email"
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="staff-role">Role</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (
                        value === "SUPERADMIN" ||
                        value === "FINANCE" ||
                        value === "OPS"
                      ) {
                        field.onChange(value);
                      }
                    }}
                  >
                    <SelectTrigger id="staff-role" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUPERADMIN">Superadmin</SelectItem>
                      <SelectItem value="FINANCE">Finance</SelectItem>
                      <SelectItem value="OPS">Ops</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="staff-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="staff-password"
                    type="password"
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-muted-foreground">
                    Required for new accounts; ignored if the email already
                    exists.
                  </p>
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
            form="invite-staff-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Add staff"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
