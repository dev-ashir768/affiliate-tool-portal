"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { completeTikTokShopOAuth } from "@/services/shops";
import { Skeleton } from "@/components/ui/skeleton";

function CallbackInner() {
  const params = useSearchParams();
  const router = useRouter();
  const code = params.get("code");
  const state = params.get("state");
  const paramError =
    !code || !state
      ? "Missing code or state from TikTok. Start authorization again."
      : null;
  const [oauthError, setOauthError] = useState<string | null>(null);
  const error = paramError ?? oauthError;

  useEffect(() => {
    if (!code || !state) return;
    let cancelled = false;
    void (async () => {
      try {
        await completeTikTokShopOAuth({ code, state });
        if (!cancelled) router.replace("/shops?oauth=connected");
      } catch (err) {
        if (!cancelled) {
          setOauthError(err instanceof Error ? err.message : "OAuth failed");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, state, router]);

  if (error) {
    return (
      <div className="mx-auto max-w-md space-y-3 px-4 py-16">
        <h1 className="text-lg font-semibold">TikTok authorization failed</h1>
        <p className="text-sm text-destructive">{error}</p>
        <a href="/shops" className="text-sm underline">
          Back to shops
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-3 px-4 py-16">
      <h1 className="text-lg font-semibold">Connecting TikTok Shop…</h1>
      <p className="text-sm text-muted-foreground">
        Exchanging authorization code and loading your shop cipher.
      </p>
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

export default function TikTokOAuthCallbackPage() {
  return (
    <Suspense fallback={<Skeleton className="m-8 h-24 w-full max-w-md" />}>
      <CallbackInner />
    </Suspense>
  );
}
