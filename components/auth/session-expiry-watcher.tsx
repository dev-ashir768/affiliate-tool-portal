"use client";

import { useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";

/** Auth endpoints answer 401 for bad credentials — never treat those as expiry. */
const IGNORED = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/logout",
  "/api/orgs/invites/",
];

const PUBLIC_PAGES = ["/login", "/signup", "/forgot-password", "/reset-password", "/invite"];

let redirecting = false;

async function isSessionExpired(res: Response): Promise<boolean> {
  try {
    const body = (await res.clone().json()) as { error?: { code?: string } };
    return body?.error?.code === "SESSION_EXPIRED";
  } catch {
    return false;
  }
}

function isWatchedApi(input: RequestInfo | URL): boolean {
  const raw =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url;
  const url = new URL(raw, window.location.origin);
  if (url.origin !== window.location.origin) return false;
  if (!url.pathname.startsWith("/api/")) return false;
  return !IGNORED.some((p) => url.pathname.startsWith(p));
}

/**
 * BFF routes refresh the session themselves; a 401 that still comes back means
 * the refresh token is gone. Send the user to /login once instead of leaving
 * every query on the page in an error state.
 */
export function SessionExpiryWatcher() {
  const router = useRouter();

  useEffect(() => {
    const original = window.fetch;
    window.fetch = async (input, init) => {
      const res = await original(input, init);
      if (
        res.status === 401 &&
        !redirecting &&
        isWatchedApi(input) &&
        // Only a genuinely ended session — not an upstream 401 (e.g. TikTok).
        (await isSessionExpired(res))
      ) {
        const path = window.location.pathname;
        if (!PUBLIC_PAGES.some((p) => path === p || path.startsWith(`${p}/`))) {
          redirecting = true;
          // Burst of parallel 401s → one redirect; re-arm for later sessions.
          window.setTimeout(() => {
            redirecting = false;
          }, 5_000);
          router.replace(`/login?next=${encodeURIComponent(path)}`);
        }
      }
      return res;
    };
    return () => {
      window.fetch = original;
    };
  }, [router]);

  return null;
}
