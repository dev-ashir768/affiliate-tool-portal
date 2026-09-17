export type OrganizationCurrent = {
  id: string;
  name: string;
  slug: string;
  seatLimit: number;
  shopLimit: number;
  dailyInviteQuota: number;
  plan: { id: string; code: string; name: string };
  subscriptionStatus: string | null;
};
