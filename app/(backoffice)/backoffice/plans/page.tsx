import { PlansAdminPage } from "@/components/backoffice/plans/plans-admin-page";

export const metadata = {
  title: "Plans",
  description: "Manage subscription plan pricing and limits",
};

export default function BackofficePlansPage() {
  return <PlansAdminPage />;
}
