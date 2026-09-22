export type BillingPlan = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  monthlyPriceCents: number;
  seatLimit: number;
  shopLimit: number;
  botLimit: number;
  dailyInviteQuota: number;
  trialDays: number;
  hasStripePrice?: boolean;
};

export type BillingPlansResponse = {
  plans: BillingPlan[];
};

export type BillingOverviewResponse = {
  hasProductAccess: boolean;
  subscription: {
    status: string;
    currentPeriodEnd: string | null;
    stripeSubscriptionId: string;
  } | null;
  organization: {
    id: string;
    planCode: string;
    planName: string;
    seatLimit: number;
    shopLimit: number;
    botLimit: number;
    dailyInviteQuota: number;
    stripeCustomerId: string | null;
  };
  plans: BillingPlan[];
};

export type CheckoutSessionResponse = {
  url: string | null;
  id: string;
  mode?: "checkout" | "upgrade";
};

export type PortalSessionResponse = {
  url: string;
};

export type PlatformPlan = BillingPlan & {
  isPublic: boolean;
  active: boolean;
  sortOrder: number;
  stripePriceId?: string | null;
};

export type PlatformPlansResponse = {
  plans: PlatformPlan[];
};
