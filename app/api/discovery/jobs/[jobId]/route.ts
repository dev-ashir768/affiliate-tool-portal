import { NextResponse } from "next/server";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";

type Props = { params: Promise<{ jobId: string }> };

export async function GET(_req: Request, { params }: Props) {
  try {
    const { jobId } = await params;
    const data = await authenticatedApiFetch(
      `/api/v1/discovery/jobs/${encodeURIComponent(jobId)}`,
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load discovery job status");
  }
}
