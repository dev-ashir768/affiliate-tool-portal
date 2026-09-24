export type MeUser = {
  id: string;
  email: string;
  name: string;
};

export type MeMembership = {
  role: "OWNER" | "ADMIN" | "MEMBER";
  organization: {
    id: string;
    name: string;
    slug: string;
    planCode: string;
    seatLimit: number;
    shopLimit: number;
    botLimit?: number;
    subscriptionStatus: string | null;
    hasProductAccess?: boolean;
    currentPeriodEnd?: string | null;
  };
};

export type PlatformMembership = {
  role: "SUPERADMIN" | "FINANCE" | "OPS";
  status: "ACTIVE" | "DISABLED";
};

export type MeResponse = {
  user: MeUser;
  currentOrganizationId: string | null;
  platformMembership: PlatformMembership | null;
  memberships: MeMembership[];
  redirectTo: string;
};
