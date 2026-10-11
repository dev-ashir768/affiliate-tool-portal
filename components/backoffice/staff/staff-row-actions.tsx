"use client";

import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMe } from "@/hooks/use-me";
import { usePatchPlatformStaff } from "@/hooks/use-platform";
import { useAdminResetTwoFactor } from "@/hooks/use-two-factor";
import type { PlatformRole, PlatformStaff } from "@/types/platform";

const ROLES: PlatformRole[] = ["SUPERADMIN", "FINANCE", "OPS"];

export function StaffRowActions({ staff }: { staff: PlatformStaff }) {
  const patch = usePatchPlatformStaff();
  const meQuery = useMe();
  const resetTwoFactor = useAdminResetTwoFactor();
  const [resetOpen, setResetOpen] = useState(false);
  const isSuperadmin = meQuery.data?.platformMembership?.role === "SUPERADMIN";

  async function confirmReset() {
    try {
      await resetTwoFactor.mutateAsync(staff.userId);
      toast.success(`2FA reset for ${staff.email}`);
      setResetOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reset 2FA");
    }
  }

  async function update(body: {
    role?: PlatformRole;
    status?: "ACTIVE" | "DISABLED";
  }) {
    try {
      await patch.mutateAsync({ id: staff.id, body });
      if (body.role) toast.success(`Role set to ${body.role}`);
      if (body.status === "DISABLED") toast.success("Staff disabled");
      if (body.status === "ACTIVE") toast.success("Staff enabled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <>
    <DropdownMenu>
      {/* Match topbar: native trigger styles — nested Button via `render` can crash Base UI Menu. */}
      <DropdownMenuTrigger
        type="button"
        disabled={patch.isPending}
        aria-label={`Actions for ${staff.name}`}
        className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
      >
        <MoreHorizontalIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuLabel>Role</DropdownMenuLabel>
        {ROLES.map((role) => (
          <DropdownMenuItem
            key={role}
            disabled={patch.isPending || staff.role === role}
            onClick={() => {
              void update({ role });
            }}
          >
            {role}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        {staff.status === "ACTIVE" ? (
          <DropdownMenuItem
            disabled={patch.isPending}
            onClick={() => {
              void update({ status: "DISABLED" });
            }}
          >
            Disable
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            disabled={patch.isPending}
            onClick={() => {
              void update({ status: "ACTIVE" });
            }}
          >
            Enable
          </DropdownMenuItem>
        )}
        {isSuperadmin ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Security</DropdownMenuLabel>
            <DropdownMenuItem
              disabled={patch.isPending}
              onClick={() => setResetOpen(true)}
            >
              Reset 2FA
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
    {isSuperadmin ? (
      <Dialog
        open={resetOpen}
        onOpenChange={(next) => {
          if (!resetTwoFactor.isPending) setResetOpen(next);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset two-factor authentication?</DialogTitle>
            <DialogDescription>
              {staff.name} ({staff.email}) will lose their authenticator,
              backup codes, and trusted devices, and must set up 2FA again on
              next sign-in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={resetTwoFactor.isPending}
              onClick={() => setResetOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={resetTwoFactor.isPending}
              onClick={() => void confirmReset()}
            >
              {resetTwoFactor.isPending ? "Resetting…" : "Reset 2FA"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ) : null}
    </>
  );
}
