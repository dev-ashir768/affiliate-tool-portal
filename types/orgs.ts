export type OrganizationCurrent = {
  id: string;
  name: string;
  slug: string;
  seatLimit: number;
  shopLimit: number;
  botLimit: number;
  dailyInviteQuota: number;
  plan: { id: string; code: string; name: string };
  subscriptionStatus: string | null;
};

export type OrgMemberRole = "OWNER" | "ADMIN" | "MEMBER";
export type OrgMemberStatus = "INVITED" | "ACTIVE" | "DISABLED";

export type OrgMember = {
  id: string; // membership id
  role: OrgMemberRole;
  status: OrgMemberStatus;
  name: string;
  email: string;
  userId: string;
};

export type MembersListParams = {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: "name" | "email" | "role" | "status";
  sortOrder?: "asc" | "desc";
};

export type MembersListResponse = {
  data: OrgMember[];
  meta: { total: number; page: number; pageSize: number };
};

export type CreateInviteResponse = {
  inviteToken: string;
  membership: {
    id: string;
    role: Exclude<OrgMemberRole, "OWNER">;
    status: OrgMemberStatus;
    email: string;
    inviteExpiresAt: string | null;
  };
};

export type AcceptInviteResponse = {
  membership: {
    id: string;
    role: OrgMemberRole;
    status: OrgMemberStatus;
    organizationId: string;
  };
  user: {
    id: string;
    email: string;
    name: string;
  };
  /** Set by BFF: session present → /home; else → /login */
  redirectTo: string;
};
