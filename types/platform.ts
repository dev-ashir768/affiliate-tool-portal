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
  orgsByPlan: Array<{ planCode: string; planName: string; count: number }>;
  subscriptionsByStatus: Array<{ status: string; count: number }>;
  mrrCents: number;
  paidOrganizationCount: number;
};
