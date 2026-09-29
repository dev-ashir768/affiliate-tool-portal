"use client";

import { useState } from "react";
import { UserPlusIcon } from "lucide-react";
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
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";
import { useCreatePlatformCreator } from "@/hooks/use-platform";

export function AddPlatformCreatorDialog({
  orgOptions,
}: {
  orgOptions: SelectOption[];
}) {
  const create = useCreatePlatformCreator();
  const [open, setOpen] = useState(false);
  const [organizationId, setOrganizationId] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");

  function resetForm() {
    setOrganizationId("");
    setHandle("");
    setEmail("");
    setDisplayName("");
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) resetForm();
  }

  async function onSubmit() {
    if (!organizationId || !handle.trim()) {
      toast.error("Organization and handle are required");
      return;
    }
    try {
      await create.mutateAsync({
        organizationId,
        handle: handle.trim(),
        displayName: displayName.trim() || null,
        contactEmail: email.trim() || null,
      });
      toast.success("Creator added to organization");
      handleOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button type="button" />}>
        <UserPlusIcon data-icon="inline-start" />
        Add creator
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add creator</DialogTitle>
          <DialogDescription>
            Attach a creator to a merchant organization.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Organization
            </label>
            <AppReactSelect
              portalMenu
              options={orgOptions}
              value={stringSelectValue(orgOptions, organizationId)}
              onChange={(opt) =>
                setOrganizationId(opt?.value ? String(opt.value) : "")
              }
              placeholder="Select org…"
              isSearchable
              aria-label="Organization"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Handle
            </label>
            <Input
              placeholder="@creator"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Display name
            </label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Contact email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            disabled={create.isPending || !organizationId || !handle.trim()}
            onClick={() => void onSubmit()}
          >
            {create.isPending ? "Adding…" : "Add creator"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
