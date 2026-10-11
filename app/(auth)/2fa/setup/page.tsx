import TwoFactorSetupForm from "@/components/auth/two-factor-setup-form";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Set up two-factor authentication",
  description: "Secure your influxa account with an authenticator app.",
});

export default function TwoFactorSetupPage() {
  return <TwoFactorSetupForm />;
}
