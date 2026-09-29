"use client";

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
import { usePatchPlatformStaff } from "@/hooks/use-platform";
import type { PlatformRole, PlatformStaff } from "@/types/platform";

const ROLES: PlatformRole[] = ["SUPERADMIN", "FINANCE", "OPS"];

export function StaffRowActions({ staff }: { staff: PlatformStaff }) {
  const patch = usePatchPlatformStaff();

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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
