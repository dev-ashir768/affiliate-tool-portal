import { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { FlashToastListener } from "@/components/ui/flash-toast-listener";
import { SessionExpiryWatcher } from "@/components/auth/session-expiry-watcher";
import QueryProvider from "./query-provider";

type Props = { children: ReactNode };

export const Providers = ({ children }: Props) => {
  return (
    <NuqsAdapter>
      <QueryProvider>
        {children}
        <FlashToastListener />
        <SessionExpiryWatcher />
        <Toaster position="top-right" richColors />
      </QueryProvider>
    </NuqsAdapter>
  );
};
