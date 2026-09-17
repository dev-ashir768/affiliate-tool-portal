import AcceptInviteForm from "@/components/invites/accept-invite-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accept invite",
  description: "Accept your organization invite",
};

type Props = { params: Promise<{ token: string }> };

export default async function AcceptInvitePage({ params }: Props) {
  const { token } = await params;
  return <AcceptInviteForm token={token} />;
}
