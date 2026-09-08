import AuthWrapper from "@/components/auth/auth-wrapper";
import { ReactNode } from "react";

type Props = { children: ReactNode };

export default function AuthLayout({ children }: Props) {
  return (
    <>
      <AuthWrapper>{children}</AuthWrapper>
    </>
  );
}
