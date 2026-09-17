import { OrganizationDetail } from "@/components/backoffice/organizations/organization-detail";

type PageProps = { params: Promise<{ id: string }> };

export default async function OrganizationDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <OrganizationDetail id={id} />;
}
