import type {
  BillingPlansResponse,
  CheckoutSessionResponse,
  PortalSessionResponse,
} from "@/types/billing";
import type { CheckoutSessionSchemaType } from "@/validations/billing.validations";

export async function fetchBillingPlans(
  signal?: AbortSignal,
): Promise<BillingPlansResponse> {
  const res = await fetch("/api/billing/plans", {
    method: "GET",
    credentials: "include",
    signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Failed to load plans");
  }
  return data as BillingPlansResponse;
}

export async function createCheckoutSession(
  body: CheckoutSessionSchemaType,
): Promise<CheckoutSessionResponse> {
  const res = await fetch("/api/billing/checkout-session", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Failed to start checkout");
  }
  return data as CheckoutSessionResponse;
}

export async function createPortalSession(): Promise<PortalSessionResponse> {
  const res = await fetch("/api/billing/portal-session", {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Failed to open billing portal");
  }
  return data as PortalSessionResponse;
}
