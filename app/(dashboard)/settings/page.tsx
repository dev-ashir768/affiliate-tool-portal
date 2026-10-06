import { OrgSettingsForm } from "@/components/settings/org-settings-form";
import { PageHeader } from "@/components/layout/page-header";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Settings",
  description:
    "Update your organization profile, timezone, and plan limits in Tiksly.",
});

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="View plan limits and update your organization name."
      />
      <OrgSettingsForm />
    </div>
  );
}
