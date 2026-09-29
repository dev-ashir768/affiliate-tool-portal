import ResetPasswordForm from "@/components/auth/reset-password-form";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Reset password",
  description: "Set a new password for your Tiksly account using your secure reset link.",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
