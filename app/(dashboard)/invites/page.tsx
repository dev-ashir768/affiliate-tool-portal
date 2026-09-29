import { InvitesPageContent } from "@/components/invites/invites-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Invites",
  description:
    "Manage pending creator and collaborator invites for your organization.",
});

export default function InvitesPage() {
  return <InvitesPageContent />;
}
