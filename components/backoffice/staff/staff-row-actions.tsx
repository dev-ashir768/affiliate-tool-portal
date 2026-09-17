"use client";

import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [error, setError] = useState<string | null>(null);

  async function update(body: {
    role?: PlatformRole;
    status?: "ACTIVE" | "DISABLED";
  }) {
    setError(null);
    try {
      await patch.mutateAsync({ id: staff.id, body });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for ${staff.name}`}
            />
          }
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Role</DropdownMenuLabel>
          {ROLES.map((role) => (
            <DropdownMenuItem
              key={role}
              disabled={patch.isPending || staff.role === role}
              onClick={() => void update({ role })}
            >
              {role}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {staff.status === "ACTIVE" ? (
            <DropdownMenuItem
              disabled={patch.isPending}
              onClick={() => void update({ status: "DISABLED" })}
            >
              Disable
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled={patch.isPending}
              onClick={() => void update({ status: "ACTIVE" })}
            >
              Enable
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {error ? (
        <p className="max-w-40 text-right text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
