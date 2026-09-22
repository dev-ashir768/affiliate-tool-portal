export type ShopRegion = "US" | "UK";

export type ShopStatus =
  | "PENDING_INVITE"
  | "VERIFYING"
  | "ACTIVE"
  | "FAILED"
  | "DISCONNECTED";

export type Shop = {
  id: string;
  organizationId: string;
  region: ShopRegion;
  botIdentityId: string | null;
  botEmail: string | null;
  status: ShopStatus;
  statusReason: string | null;
  displayName: string | null;
  externalShopId: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  oauthConnected?: boolean;
  oauthScopes?: string[];
  oauthAccessExpiresAt?: string | null;
};

export type ShopsListResponse = {
  shops: Shop[];
};

export type VerifyShopResponse = {
  verificationJobId: string;
  status: "PENDING_INVITE" | "VERIFYING";
};
