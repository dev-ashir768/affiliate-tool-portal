import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { InviteMemberDialog } from "@/components/team/invite-member-dialog";
import { MembersTable } from "@/components/team/members-table";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Team",
  description:
    "Invite colleagues and manage roles for your Tiksly organization.",
});

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Team</h1>
          <p className="mt-1 text-sm text-muted-foreground">
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
