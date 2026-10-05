/**
 * Only allow browser redirects to Stripe Checkout / Customer Portal,
 * or back to this portal origin (upgrade/downgrade success URLs).
 */
export function assertSafeBillingRedirectUrl(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid billing redirect URL");
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("Invalid billing redirect protocol");
  }

  const host = parsed.hostname.toLowerCase();
  const stripeHosts = new Set([
    "checkout.stripe.com",
    "billing.stripe.com",
  ]);
  if (stripeHosts.has(host) || host.endsWith(".stripe.com")) {
    return url;
  }

  const allowedOrigins = new Set<string>();
  if (typeof window !== "undefined" && window.location?.origin) {
    allowedOrigins.add(window.location.origin);
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) {
    try {
      allowedOrigins.add(new URL(appUrl).origin);
    } catch {
      /* ignore invalid env */
    }
  }

  if (allowedOrigins.has(parsed.origin)) {
    return url;
  }

  throw new Error("Billing redirect URL is not allowed");
}

export function redirectToBillingUrl(url: string) {
  window.location.href = assertSafeBillingRedirectUrl(url);
}
