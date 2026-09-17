export type BillingPlan = {
  id: string;
  code: string;
  name: string;
  monthlyPriceCents: number;
  seatLimit: number;
  shopLimit: number;
  dailyInviteQuota: number;
};

export type BillingPlansResponse = {
  plans: BillingPlan[];
};

export type CheckoutSessionResponse = {
  url: string | null;
  id: string;
};

export type PortalSessionResponse = {
  url: string;
};
