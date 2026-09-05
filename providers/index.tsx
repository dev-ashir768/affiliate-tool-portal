import { ReactNode } from "react";
import QueryProvider from "./query-provider";

type Props = { children: ReactNode };

export const Providers = ({ children }: Props) => {
  return (
    <>
      <QueryProvider>{children}</QueryProvider>
    </>
  );
};
