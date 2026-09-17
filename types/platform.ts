export type PlatformRole = "SUPERADMIN" | "FINANCE" | "OPS";
export type PlatformMembershipStatus = "ACTIVE" | "DISABLED";

export type PlatformStaff = {
  id: string;
  role: PlatformRole;
  status: PlatformMembershipStatus;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  userId: string;
  userStatus: string;
};

export type PlatformListParams = {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type PlatformListMeta = {
  total: number;
  page: number;
  pageSize: number;
};

export type PlatformStaffListResponse = {
  data: PlatformStaff[];
  meta: PlatformListMeta;
};

export type PlatformOrgSummary = {
  id: string;
  name: string;
  slug: string;
  seatLimit: number;
  shopLimit: number;
  dailyInviteQuota: number;
  createdAt: string;
  plan: { id: string; code: string; name: string };
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  shopCount?: number;
  memberCount?: number;
};

export type PlatformOrgListResponse = {
  data: PlatformOrgSummary[];
  meta: PlatformListMeta;
};

export type PlatformOrgDetail = PlatformOrgSummary & {
  stripeCustomerId: string | null;
  members: Array<{
    id: string;
    role: string;
    status: string;
    user: { id: string; email: string; name: string; status: string };
  }>;
  shops: Array<{
    id: string;
    region: string;
    status: string;
    displayName: string | null;
    externalShopId: string | null;
    botEmail: string | null;
    verifiedAt: string | null;
    createdAt: string;
  }>;
};

export type PlatformShopRow = {
  id: string;
  region: string;
  status: string;
  statusReason: string | null;
  displayName: string | null;
  externalShopId: string | null;
  botEmail: string | null;
  verifiedAt: string | null;
  createdAt: string;
  organization: { id: string; name: string; slug: string };
};

export type PlatformShopListResponse = {
  data: PlatformShopRow[];
  meta: PlatformListMeta;
};

export type BillingOverview = {
  organizationCount: number;
  freeOrganizationCount: number;
  paidOrganizationCount: number;
  activeSubscriptionCount: number;
  pastDueCount: number;
  trialingCount: number;
  avgMrrPerPaidOrgCents: number;
  orgsByPlan: Array<{ planCode: string; planName: string; count: number }>;
  revenueByPlan: Array<{
    planCode: string;
    planName: string;
    orgCount: number;
    monthlyPriceCents: number;
    mrrCents: number;
  }>;
  subscriptionsByStatus: Array<{ status: string; count: number }>;
  mrrCents: number;
};

export type ProxyStatus = "AVAILABLE" | "IN_USE" | "DISABLED" | "BANNED";
export type ProxyProtocol = "HTTP" | "HTTPS" | "SOCKS5";

export type PlatformProxy = {
  id: string;
  label: string;
  host: string;
  port: number;
  protocol: ProxyProtocol;
  username: string | null;
  hasPassword: boolean;
  region: string | null;
  status: ProxyStatus;
  lastCheckedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PlatformProxyListResponse = {
  data: PlatformProxy[];
  meta: PlatformListMeta;
};

export type PlatformCrawlerStatus = {
  status: string;
  lastRunAt: string | null;
  queue?: string;
  note: string;
};
