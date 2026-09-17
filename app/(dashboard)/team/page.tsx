import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { InviteMemberDialog } from "@/components/team/invite-member-dialog";
import { MembersTable } from "@/components/team/members-table";

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Team</h1>
          <p className="text-sm text-muted-foreground">
            Manage members and invites for your organization.
          </p>
        </div>
        <InviteMemberDialog />
      </div>
      <Suspense fallback={<DataTableSkeleton />}>
        <MembersTable />
      </Suspense>
    </div>
  );
}
