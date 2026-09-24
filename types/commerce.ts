export type DiscoveryProfile = {
  id: string;
  platform: string;
  handle: string;
  displayName: string | null;
  creatorOpenId?: string | null;
  region: string | null;
  followerCount: number | null;
  avatarUrl?: string | null;
  gmvAmount?: string | null;
  gmvCurrency?: string | null;
  gmvRange?: string | null;
  gmvCents?: number | null;
  videoGmvAmount?: string | null;
  liveGmvAmount?: string | null;
  productCardGmvAmount?: string | null;
  avgCommissionRange?: string | null;
  unitsSold?: number | null;
  gpmAmount?: string | null;
  gpmCurrency?: string | null;
  gpmRange?: string | null;
  contactEmail?: string | null;
  categories: string[];
  bio: string | null;
  source: string;
  enabled: boolean;
  metricsSyncedAt?: string | null;
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

export type AnalyticsGmvShop = {
  kind: "shop_orders";
  label: string;
  description: string;
  gmvCents: number;
  orders: number;
  commissionCents: number;
  byCurrency: Array<{
    currency: string;
    gmvCents: number;
    orders: number;
  }>;
};

export type AnalyticsGmvMarketplace = {
  kind: "creator_marketplace";
  label: string;
  description: string;
  creatorsWithMetrics: number;
  creatorsWithParsableGmv: number;
  creatorsWithRangeOnly: number;
  parsedGmvCents: number;
  multiCurrency: boolean;
  byCurrency: Array<{
    currency: string;
    gmvCents: number;
    creators: number;
  }>;
  lastSyncedAt: string | null;
};

export type AnalyticsTopMarketplaceCreator = {
  id: string;
  handle: string;
  displayName: string | null;
  followerCount: number | null;
  gmvAmount: string | null;
  gmvCurrency: string | null;
  gmvRange: string | null;
  gmvCents: number | null;
  videoGmvAmount: string | null;
  liveGmvAmount: string | null;
  metricsSyncedAt: string | null;
};

export type AnalyticsOverview = {
  funnel: {
    creators: number;
    contactedOrInvited: number;
    active: number;
    outreachSent: number;
    outreachFailed: number;
    orders: number;
    /** Shop-attributed GMV (legacy alias of gmv.shop.gmvCents). */
    gmvCents: number;
    commissionCents: number;
  };
  gmv: {
    shop: AnalyticsGmvShop;
    marketplace: AnalyticsGmvMarketplace;
  };
  topMarketplaceCreators: AnalyticsTopMarketplaceCreator[];
  shopGmvByCreator?: Array<{
    creatorId: string;
    handle: string | null;
    displayName: string | null;
    gmvCents: number;
    orders: number;
  }>;
  campaignsPerformance?: Array<{
    id: string;
    name: string;
    status: string;
    invites: number;
    outreachSent: number;
  }>;
  recentOrders: Array<{
    id: string;
    externalOrderId: string;
    gmvCents: number;
    currency?: string;
    status: string;
    orderedAt: string;
    creatorHandle?: string | null;
  }>;
  range?: {
    from: string | null;
    to: string | null;
  };
  charts?: {
    gmvByDay: Array<{ date: string; gmvCents: number }>;
  };
};
