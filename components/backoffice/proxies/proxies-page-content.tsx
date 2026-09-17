"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreatePlatformProxy,
  usePatchPlatformProxy,
  usePlatformProxies,
} from "@/hooks/use-platform";
import {
  createProxySchema,
  type CreateProxySchemaType,
} from "@/validations/platform.validations";
import type { PlatformProxy } from "@/types/platform";

function AddProxyDialog() {
  const create = useCreatePlatformProxy();
  const [open, setOpen] = useState(false);
  const form = useForm<CreateProxySchemaType>({
    resolver: zodResolver(createProxySchema),
    defaultValues: {
      label: "",
      host: "",
      port: 8080,
      protocol: "HTTP",
      username: "",
      password: "",
      region: "",
    },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      form.reset({
        label: "",
        host: "",
        port: 8080,
        protocol: "HTTP",
        username: "",
        password: "",
        region: "",
      });
      form.clearErrors();
    }
  }

  async function onSubmit(data: CreateProxySchemaType) {
    form.clearErrors("root");
    try {
      await create.mutateAsync({
        ...data,
        username: data.username || null,
        password: data.password || null,
        region: data.region || null,
      });
      toast.success("Proxy added");
      handleOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create proxy";
      form.setError("root", { message });
      toast.error(message);
    }
  }

  const formError = form.formState.errors.root;
  const isSubmitting = form.formState.isSubmitting || create.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button type="button" />}>
        <PlusIcon data-icon="inline-start" />
        Add proxy
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add proxy</DialogTitle>
          <DialogDescription>
            Store a proxy endpoint for bot / verify traffic. Passwords are
            encrypted at rest.
          </DialogDescription>
        </DialogHeader>
        <form
          id="add-proxy-form"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="label"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor={field.name}>Label</FieldLabel>
                  <Input id={field.name} {...field} placeholder="US residential 1" />
                  {fieldState.error ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
            <Controller
              name="host"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor={field.name}>Host</FieldLabel>
                  <Input id={field.name} {...field} placeholder="proxy.example.com" />
                  {fieldState.error ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="port"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor={field.name}>Port</FieldLabel>
                    <Input
                      id={field.name}
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    {fieldState.error ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
              <Controller
                name="protocol"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel>Protocol</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HTTP">HTTP</SelectItem>
                        <SelectItem value="HTTPS">HTTPS</SelectItem>
                        <SelectItem value="SOCKS5">SOCKS5</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="username"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    type="password"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    autoComplete="new-password"
                  />
                </Field>
              )}
            />
            <Controller
              name="region"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Region</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="US"
                  />
                </Field>
              )}
            />
            {formError ? <FieldError errors={[formError]} /> : null}
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="add-proxy-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Save proxy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProxyRowActions({ proxy }: { proxy: PlatformProxy }) {
  const patch = usePatchPlatformProxy();

  async function setStatus(status: PlatformProxy["status"]) {
    try {
      await patch.mutateAsync({ id: proxy.id, body: { status } });
      toast.success(`Proxy marked ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {proxy.status !== "DISABLED" ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={patch.isPending}
          onClick={() => void setStatus("DISABLED")}
        >
          Disable
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={patch.isPending}
          onClick={() => void setStatus("AVAILABLE")}
        >
          Enable
        </Button>
      )}
      {proxy.status !== "BANNED" ? (
        <Button
          type="button"
          size="sm"
          variant="destructive"
          disabled={patch.isPending}
          onClick={() => void setStatus("BANNED")}
        >
          Ban
        </Button>
      ) : null}
    </div>
  );
}

export function ProxiesPageContent() {
  const query = usePlatformProxies({ page: 1, pageSize: 50 });

  if (query.isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (query.isError) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {query.error instanceof Error
          ? query.error.message
          : "Unable to load proxies"}
      </p>
    );
  }

  const rows = query.data?.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Proxies</h1>
          <p className="text-sm text-muted-foreground">
            Proxy pool for bot and shop-verify traffic.
          </p>
        </div>
        <AddProxyDialog />
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No proxies yet. Add one to start allocating traffic.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="px-3 py-2 font-medium">Label</th>
                <th className="px-3 py-2 font-medium">Endpoint</th>
                <th className="px-3 py-2 font-medium">Region</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((proxy) => (
                <tr key={proxy.id} className="border-t border-border">
                  <td className="px-3 py-2">{proxy.label}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {proxy.protocol.toLowerCase()}://{proxy.host}:{proxy.port}
                    {proxy.hasPassword ? " · auth" : ""}
                  </td>
                  <td className="px-3 py-2">{proxy.region ?? "—"}</td>
                  <td className="px-3 py-2">
                    <Badge variant="secondary">{proxy.status}</Badge>
                  </td>
                  <td className="px-3 py-2">
                    <ProxyRowActions proxy={proxy} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
