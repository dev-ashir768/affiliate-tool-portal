import { OrgSettingsForm } from "@/components/settings/org-settings-form";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Settings",
  description:
    "Update your organization profile, timezone, and plan limits in Tiksly.",
});

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          View plan limits and update your organization name.
        </p>
      </div>
      <OrgSettingsForm />
    </div>
  );
}
