export type ShopRegion = "US" | "UK";

export type ShopStatus =
  | "PENDING_INVITE"
  | "VERIFYING"
  | "ACTIVE"
  | "FAILED"
  | "DISCONNECTED";

export type OpenCollabCreatorsSyncStatus = {
  status: "QUEUED" | "RUNNING" | "SUCCEEDED" | "PARTIAL" | "FAILED";
  jobId?: string | null;
  productsScanned: number;
  creatorsUpserted: number;
  creatorsLinkedToList: number;
  failedProducts: number;
  lastError?: string | null;
  updatedAt: string;
};

export type Shop = {
  id: string;
  organizationId: string;
  region: ShopRegion;
  botIdentityId: string | null;
  botEmail: string | null;
  /** Bot generated for this organization (merchant sets it up themselves). */
  botSelfServe?: boolean;
  /** When the bot's TikTok sign-in was saved; null = not activated. */
  botActivatedAt?: string | null;
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
  openCollabCreatorsSync?: OpenCollabCreatorsSyncStatus | null;
};

export type BotMailSummary = {
  subject: string;
  from: string;
  receivedAt: string;
  code: string | null;
  preview: string;
};

export type BotInboxResponse = {
  botEmail: string;
  messages: BotMailSummary[];
};

export type ShopsListResponse = {
  shops: Shop[];
};

export type VerifyShopResponse = {
  verificationJobId: string;
  status: "PENDING_INVITE" | "VERIFYING";
};
