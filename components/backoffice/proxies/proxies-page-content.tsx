"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/data-table";
import { useClientDataTable } from "@/hooks/use-client-data-table";
import {
  useCreatePlatformProxy,
  usePlatformProxies,
} from "@/hooks/use-platform";
import { proxiesColumns } from "@/components/backoffice/proxies/proxies-columns";
import {
  createProxySchema,
  type CreateProxySchemaType,
} from "@/validations/platform.validations";

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

export function ProxiesPageContent() {
  const query = usePlatformProxies({ page: 1, pageSize: 50 });
  const rows = query.data?.data ?? [];
  const tableState = useClientDataTable({
    data: rows,
    getSearchText: (p) =>
      [p.label, p.host, p.region, p.status, p.protocol].filter(Boolean).join(" "),
    getSortValue: (p, id) => {
      if (id === "endpoint") {
        return `${p.host}:${p.port}`;
      }
      return (p as Record<string, unknown>)[id] as
        | string
        | number
        | null
        | undefined;
    },
  });

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
        <DataTable
          tableId="platform-proxies"
          columns={proxiesColumns}
          data={tableState.data}
          totalCount={tableState.totalCount}
          pagination={tableState.pagination}
          onPaginationChange={tableState.onPaginationChange}
          sorting={tableState.sorting}
          onSortingChange={tableState.onSortingChange}
          search={tableState.search}
          onSearchChange={tableState.onSearchChange}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          isError={query.isError}
          onRetry={() => void query.refetch()}
          onRefresh={() => void query.refetch()}
          getRowId={(row) => row.id}
          ariaLabel="Proxies"
          pageSizeOptions={[10, 20, 50]}
        />
      )}
    </div>
  );
}
