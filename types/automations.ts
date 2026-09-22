export type AutomationRunStep = {
  id: string;
  stepIndex: number;
  kind: "EMAIL" | "AFFILIATE_INVITE" | string;
  status: string;
  delayMinutes: number;
  config: unknown;
  result: unknown;
  lastError: string | null;
  scheduledAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
};

export type AutomationRun = {
  id: string;
  campaignId: string | null;
  campaignName: string | null;
  shopId: string | null;
  shopDisplayName: string | null;
  name: string;
  status: string;
  creatorIds: string[];
  lastError: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  steps: AutomationRunStep[];
};
