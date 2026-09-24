export type AffiliateInviteRecipient = {
  id: string;
  creatorId: string;
  creatorOpenId: string;
  creatorHandle: string | null;
  creatorDisplayName: string | null;
  status: string;
  lastError: string | null;
};

export type AffiliateInvite = {
  id: string;
  shopId: string;
  shopDisplayName: string | null;
  shopRegion: string | null;
  campaignId: string | null;
  name: string;
  message: string | null;
  endAt: string;
  sellerContactEmail: string | null;
  hasFreeSample: boolean;
  sampleApprovalExempt: boolean;
  products: unknown;
  externalCollaborationId: string | null;
  status: string;
  lastError: string | null;
  conflicts: unknown;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
  recipients: AffiliateInviteRecipient[];
};

export type { ShopProductSummary } from "@/types/products";

