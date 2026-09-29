"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { useCreateAdminNavItem } from "@/hooks/use-platform";

export function AddNavigationItemDialog({
  sectionId,
  nextSort,
}: {
  sectionId: string;
  nextSort: number;
}) {
  const create = useCreateAdminNavItem();
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [icon, setIcon] = useState("Circle");

  function resetForm() {
    setKey("");
    setLabel("");
    setHref("");
    setIcon("Circle");
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) resetForm();
  }

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
      handleOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Create failed");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button type="button" size="sm" />}>
        <PlusIcon data-icon="inline-start" className="size-4" />
        Add navigation
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add navigation item</DialogTitle>
          <DialogDescription>
            Creates a new sidebar link in this section.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Key
            </label>
            <Input
              placeholder="users"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Label
            </label>
            <Input
              placeholder="Users"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Path
            </label>
            <Input
              placeholder="/backoffice/users"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Icon
            </label>
            <Input
              placeholder="Users"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            disabled={create.isPending || !key || !label || !href}
            onClick={() => void onAdd()}
          >
            {create.isPending ? "Adding…" : "Add item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
