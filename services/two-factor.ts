import { resolvePostAuthRedirect } from "@/lib/auth/access-token";

type PlatformMembership = { id: string; role: string; status: string } | null;

export type TwoFactorSessionResult = {
  status: string;
  redirectTo: string;
  platformMembership?: PlatformMembership;
};

export type TwoFactorSetupConfirmResult = TwoFactorSessionResult & {
  backupCodes: string[];
};

async function postJson<T>(
  url: string,
  body: unknown,
  fallbackMessage: string,
): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? fallbackMessage);
  }
  return data as T;
}

export function startTwoFactorSetup() {
  return postJson<{ otpauthUrl: string }>(
    "/api/auth/2fa/setup/start",
    undefined,
    "Failed to start 2FA setup",
  );
}

export function confirmTwoFactorSetup(code: string) {
  return postJson<TwoFactorSetupConfirmResult>(
    "/api/auth/2fa/setup/confirm",
    { code },
    "Failed to confirm 2FA setup",
  );
}

export function verifyTwoFactor(input: {
  code: string;
  rememberDevice: boolean;
}) {
  return postJson<TwoFactorSessionResult>(
    "/api/auth/2fa/verify",
    input,
    "Failed to verify code",
  );
}

/** Manual-entry secret embedded in the otpauth:// URL. */
export function secretFromOtpauthUrl(otpauthUrl: string): string | null {
  try {
    return new URL(otpauthUrl).searchParams.get("secret");
  } catch {
    return null;
  }
}

/** Where to land after a completed 2FA step. */
export function twoFactorDestination(result: TwoFactorSessionResult): string {
  return resolvePostAuthRedirect({
    next: null,
    redirectTo: result.redirectTo,
    platformRole:
      result.platformMembership?.role ??
      (result.redirectTo?.startsWith("/backoffice") ? "STAFF" : null),
  });
}

export type TrustedDevice = {
  id: string;
  label: string | null;
  createdAt: string;
  expiresAt: string;
};

export type TwoFactorStatus = {
  enabled: boolean;
  backupCodesRemaining: number;
  trustedDevices: TrustedDevice[];
};

export async function fetchTwoFactorStatus(
  signal?: AbortSignal,
): Promise<TwoFactorStatus> {
  const res = await fetch("/api/auth/2fa/status", {
    method: "GET",
    credentials: "include",
    signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Failed to load 2FA status");
  }
  return data as TwoFactorStatus;
}

export function regenerateBackupCodes(code: string) {
  return postJson<{ backupCodes: string[] }>(
    "/api/auth/2fa/backup-codes/regenerate",
    { code },
    "Failed to regenerate backup codes",
  );
}

export async function revokeTrustedDevice(id: string): Promise<void> {
  const res = await fetch(
    `/api/auth/2fa/trusted-devices/${encodeURIComponent(id)}`,
    { method: "DELETE", credentials: "include" },
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error?.message ?? "Failed to revoke device");
  }
}

export async function adminResetTwoFactor(userId: string): Promise<void> {
  const res = await fetch("/api/auth/2fa/admin/reset", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error?.message ?? "Failed to reset 2FA");
  }
}
