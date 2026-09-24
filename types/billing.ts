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
  changeKind?: "current" | "upgrade" | "downgrade" | "subscribe";
  canSwitch?: boolean;
  blockers?: Array<{
    resource: "seats" | "shops" | "bots";
    used: number;
    limit: number;
  }>;
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
  usage: { seats: number; shops: number; bots: number };
  overage: { seats: number; shops: number; bots: number };
  hasOverage: boolean;
  plans: BillingPlan[];
  rules: {
    upgrade: string;
    downgrade: string;
    cancel: string;
    effects: string[];
  };
};

export type CheckoutSessionResponse = {
  url: string | null;
  id: string;
  mode?: "checkout" | "upgrade" | "downgrade";
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
