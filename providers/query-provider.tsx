"use client";

import { ReactNode, useState } from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import dynamic from "next/dynamic";

const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then(
      (mod) => mod.ReactQueryDevtools,
    ),
  {
    ssr: false,
  },
);

type Props = { children: ReactNode };

function handleQueryError(error: unknown) {
  console.error("[react-query] query error:", error);
}

function handleMutationError(error: unknown) {
  console.error("[react-query] mutation error:", error);
}

const QueryProvider = ({ children }: Props) => {
  const [reactQuery] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleQueryError,
        }),
        mutationCache: new MutationCache({
          onError: handleMutationError,
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes cache
            gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={reactQuery}>
      {children}
      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};

export default QueryProvider;
