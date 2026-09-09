import SignupForm from "@/components/auth/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup",
  description: "Signup to your account",
};

export default function SignupPage() {
  return (
    <>
      <SignupForm />
    </>
  );
}
