import { OrganizationDetail } from "@/components/backoffice/organizations/organization-detail";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Organization",
  description:
    "Inspect a tenant’s subscription, members, shops, and billing details in Tiksly backoffice.",
});

type PageProps = { params: Promise<{ id: string }> };

export default async function OrganizationDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <OrganizationDetail id={id} />;
}
