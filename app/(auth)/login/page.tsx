import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Sign in",
  description:
    "Sign in to your influxa workspace to manage TikTok Shop affiliates, campaigns, and outreach.",
});

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
