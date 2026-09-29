import { NavigationAdminPage } from "@/components/backoffice/navigation/navigation-admin-page";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Navigation",
  description:
    "Edit sidebar navigation items and access rules shown to Tiksly customers.",
});

export default function BackofficeNavigationPage() {
  return <NavigationAdminPage />;
}
