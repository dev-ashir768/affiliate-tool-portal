import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Forgot password",
  description:
    "Request a password reset link for your Tiksly account. Check your email to choose a new password.",
});

export default function ForgotPasswordPage() {
  return (
    <>
      <ForgotPasswordForm />
    </>
  );
}
