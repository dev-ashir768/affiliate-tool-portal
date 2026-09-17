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

export type PlatformCreatorRow = {
  id: string;
  handle: string;
  displayName: string | null;
  contactEmail: string | null;
  region: string | null;
  followerCount: number | null;
  notes: string | null;
  stage: string;
  createdAt: string;
  updatedAt: string;
  organization: { id: string; name: string; slug: string };
};

export type PlatformCreatorListResponse = {
  data: PlatformCreatorRow[];
  meta: PlatformListMeta;
};

export type PlatformCrawlerStatus = {
  status: "IDLE" | "RUNNING" | "DEGRADED" | string;
  lastRunAt: string | null;
  lastJobId?: string | null;
  lastJobState?: string | null;
  queue?: string;
  counts?: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  };
  note: string;
};

export type PlatformCrawlerRunResult = {
  jobId: string;
  queue: string;
  status: "QUEUED";
};

export type AdminNavItem = {
  id: string;
  key: string;
  label: string;
  href: string;
  icon: string;
  sortOrder: number;
  badge: string | null;
  enabled: boolean;
  allowedPlatformRoles: PlatformRole[];
  allowedOrgRoles: string[];
};

export type AdminNavSection = {
  id: string;
  key: string;
  label: string | null;
  sortOrder: number;
  items: AdminNavItem[];
};

export type AdminNavResponse = {
  area: "dashboard" | "backoffice";
  sections: AdminNavSection[];
};
