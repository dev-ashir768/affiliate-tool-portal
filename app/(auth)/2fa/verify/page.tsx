import TwoFactorVerifyForm from "@/components/auth/two-factor-verify-form";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Two-factor verification",
  description: "Enter your authentication code to finish signing in.",
});

export default function TwoFactorVerifyPage() {
  return <TwoFactorVerifyForm />;
}
