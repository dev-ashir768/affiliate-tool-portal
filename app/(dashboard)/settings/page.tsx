import { OrgSettingsForm } from "@/components/settings/org-settings-form";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          View plan limits and update your organization name.
        </p>
      </div>
      <OrgSettingsForm />
    </div>
  );
}
