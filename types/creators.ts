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
  region: string | null;
  followerCount: number | null;
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
