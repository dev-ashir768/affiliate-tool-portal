"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminNavigation,
  useCreateAdminNavItem,
  usePatchAdminNavItem,
} from "@/hooks/use-platform";
import type { AdminNavItem } from "@/types/platform";

type Area = "dashboard" | "backoffice";

function NavItemRow({ item }: { item: AdminNavItem }) {
  const patch = usePatchAdminNavItem();
  const [label, setLabel] = useState(item.label);
  const [href, setHref] = useState(item.href);
  const [sortOrder, setSortOrder] = useState(item.sortOrder);

  async function save() {
    try {
      await patch.mutateAsync({
        id: item.id,
        body: { label, href, sortOrder },
      });
      toast.success("Nav item updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function toggleEnabled() {
    try {
      await patch.mutateAsync({
        id: item.id,
        body: { enabled: !item.enabled },
      });
      toast.success(item.enabled ? "Disabled" : "Enabled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <tr className="border-t border-border align-top">
      <td className="px-3 py-2 font-mono text-xs">{item.key}</td>
      <td className="px-3 py-2">
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="h-8"
        />
      </td>
      <td className="px-3 py-2">
        <Input
          value={href}
          onChange={(e) => setHref(e.target.value)}
          className="h-8 font-mono text-xs"
        />
      </td>
      <td className="px-3 py-2">
        <Input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          className="h-8 w-20"
        />
      </td>
      <td className="px-3 py-2">
        <Badge variant={item.enabled ? "secondary" : "outline"}>
          {item.enabled ? "enabled" : "disabled"}
        </Badge>
      </td>
      <td className="px-3 py-2">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            disabled={patch.isPending}
            onClick={() => void save()}
          >
            Save
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={patch.isPending}
            onClick={() => void toggleEnabled()}
          >
            {item.enabled ? "Disable" : "Enable"}
          </Button>
        </div>
      </td>
    </tr>
  );
}

function AddItemForm({
  sectionId,
  nextSort,
}: {
  sectionId: string;
  nextSort: number;
}) {
  const create = useCreateAdminNavItem();
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [icon, setIcon] = useState("Circle");

  async function onAdd() {
    try {
      await create.mutateAsync({
        sectionId,
        key,
        label,
        href,
        icon,
        sortOrder: nextSort,
      });
      toast.success("Nav item created");
      setKey("");
      setLabel("");
      setHref("");
      setIcon("Circle");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Create failed");
    }
  }

  return (
    <div className="mt-3 grid gap-2 rounded-lg border border-dashed border-border p-3 md:grid-cols-5">
      <Input
        placeholder="key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="h-8 font-mono text-xs"
      />
      <Input
        placeholder="Label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="h-8"
      />
      <Input
        placeholder="/path"
        value={href}
        onChange={(e) => setHref(e.target.value)}
        className="h-8 font-mono text-xs"
      />
      <Input
        placeholder="Icon"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
        className="h-8"
      />
      <Button
        type="button"
        size="sm"
        disabled={create.isPending || !key || !label || !href}
        onClick={() => void onAdd()}
      >
        Add item
      </Button>
    </div>
  );
}

export function NavigationAdminPage() {
  const [area, setArea] = useState<Area>("backoffice");
  const query = useAdminNavigation(area);

  const sections = useMemo(() => query.data?.sections ?? [], [query.data]);

  if (query.isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Navigation</h1>
          <p className="text-sm text-muted-foreground">
            Edit DB-backed menus for dashboard and backoffice (SUPERADMIN).
          </p>
        </div>
        <Select value={area} onValueChange={(v) => setArea(v as Area)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="backoffice">Backoffice</SelectItem>
            <SelectItem value="dashboard">Dashboard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {query.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {query.error instanceof Error
            ? query.error.message
            : "Unable to load navigation"}
        </p>
      ) : null}

      {sections.map((section) => (
        <div key={section.id} className="space-y-2">
          <h2 className="text-sm font-medium">
            Section: {section.label ?? section.key}{" "}
            <span className="font-mono text-xs text-muted-foreground">
              ({section.key})
            </span>
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Key</th>
                  <th className="px-3 py-2 font-medium">Label</th>
                  <th className="px-3 py-2 font-medium">Href</th>
                  <th className="px-3 py-2 font-medium">Order</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {section.items.map((item) => (
                  <NavItemRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
          <AddItemForm
            sectionId={section.id}
            nextSort={
              section.items.reduce((max, i) => Math.max(max, i.sortOrder), -1) +
              1
            }
          />
        </div>
      ))}
    </div>
  );
}
