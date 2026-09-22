import type { AutomationRun } from "@/types/automations";

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Request failed");
  }
  return data;
}

export async function fetchAutomationRuns(signal?: AbortSignal) {
  const res = await fetch("/api/automations", {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as { runs: AutomationRun[] };
}

export async function createAutomationRun(body: {
  name: string;
  campaignId?: string | null;
  shopId?: string | null;
  creatorIds: string[];
  steps: Array<
    | {
        kind: "EMAIL";
        delayMinutes?: number;
        templateId?: string;
        subject?: string;
        bodyText?: string;
      }
    | {
        kind: "AFFILIATE_INVITE";
        delayMinutes?: number;
        inviteName: string;
        message?: string | null;
        endAt: string;
        sellerContactEmail?: string | null;
        hasFreeSample?: boolean;
        sampleApprovalExempt?: boolean;
        products: Array<{
          id: string;
          commissionPercent: number;
          shopAdsCommissionPercent?: number;
        }>;
      }
  >;
}) {
  const res = await fetch("/api/automations", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as {
    run: AutomationRun;
    jobId: string;
    status: "QUEUED";
    queue: string;
  };
}
