import SignupForm from "@/components/auth/signup-form";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Sign up",
  description:
    "Create your influxa account and start running TikTok Shop affiliate programs with your team.",
});

export default function SignupPage() {
  return (
    <>
      <SignupForm />
    </>
  );
}
