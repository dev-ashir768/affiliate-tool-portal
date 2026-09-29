import AcceptInviteForm from "@/components/invites/accept-invite-form";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Accept invite",
  description:
    "Join your team on Tiksly by accepting this organization invite and setting up your account.",
  noIndex: true,
});

type Props = { params: Promise<{ token: string }> };

export default async function AcceptInvitePage({ params }: Props) {
  const { token } = await params;
  return <AcceptInviteForm token={token} />;
}
