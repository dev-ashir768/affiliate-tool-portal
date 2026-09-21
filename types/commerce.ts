export type DiscoveryProfile = {
  id: string;
  platform: string;
  handle: string;
  displayName: string | null;
  region: string | null;
  followerCount: number | null;
  categories: string[];
  bio: string | null;
  source: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ShopOrderRow = {
  id: string;
  externalOrderId: string;
  gmvCents: number;
  currency: string;
  status: string;
  orderedAt: string;
  shopId: string | null;
  creatorId: string | null;
  creatorHandle: string | null;
  commissionCents: number;
  createdAt: string;
};

export type AnalyticsOverview = {
  funnel: {
    creators: number;
    contactedOrInvited: number;
    active: number;
    outreachSent: number;
    outreachFailed: number;
    orders: number;
    gmvCents: number;
    commissionCents: number;
  };
  recentOrders: Array<{
    id: string;
    externalOrderId: string;
    gmvCents: number;
    status: string;
    orderedAt: string;
  }>;
};
