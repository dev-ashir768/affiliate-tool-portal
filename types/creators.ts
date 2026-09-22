export type CreatorStage =
  | "LEAD"
  | "CONTACTED"
  | "INVITED"
  | "ACTIVE"
  | "REJECTED";

export type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "DONE";

export type Creator = {
  id: string;
  platform: string;
  handle: string;
  displayName: string | null;
  creatorOpenId?: string | null;
  contactEmail: string | null;
  region: string | null;
  followerCount: number | null;
  avatarUrl?: string | null;
  gmvAmount?: string | null;
  gmvCurrency?: string | null;
  gmvRange?: string | null;
  videoGmvAmount?: string | null;
  liveGmvAmount?: string | null;
  productCardGmvAmount?: string | null;
  avgCommissionRange?: string | null;
  unitsSold?: number | null;
  gpmAmount?: string | null;
  gpmCurrency?: string | null;
  gpmRange?: string | null;
  metricsSyncedAt?: string | null;
  notes: string | null;
  stage: CreatorStage;
  createdAt: string;
  updatedAt: string;
};

export type CreatorList = {
  id: string;
  name: string;
  description: string | null;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Campaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  brief: string | null;
  offerNote: string | null;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OutreachTemplate = {
  id: string;
  name: string;
  subject: string;
  bodyText: string;
  createdAt: string;
  updatedAt: string;
};

export type OutreachMessage = {
  id: string;
  templateId: string | null;
  campaignId: string | null;
  creatorId: string;
  creatorHandle: string | null;
  toEmail: string | null;
  subject: string;
  status: string;
  lastError: string | null;
  sentAt: string | null;
  createdAt: string;
};
