import type {
  Shop,
  ShopsListResponse,
  VerifyShopResponse,
} from "@/types/shops";
import type { ConnectShopSchemaType } from "@/validations/shop.validations";

export class ShopsApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ShopsApiError";
  }
}

async function parseError(res: Response): Promise<ShopsApiError> {
  const data = await res.json().catch(() => ({}));
  return new ShopsApiError(
    data?.error?.message ?? "Request failed",
    data?.error?.code,
    res.status,
  );
}

export async function fetchShops(
  signal?: AbortSignal,
): Promise<ShopsListResponse> {
  const res = await fetch("/api/shops", {
    method: "GET",
    credentials: "include",
    signal,
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as ShopsListResponse;
}

export async function connectShop(
  body: ConnectShopSchemaType,
): Promise<Shop> {
  const res = await fetch("/api/shops/connect", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as Shop;
}

export async function verifyShop(id: string): Promise<VerifyShopResponse> {
  const res = await fetch(`/api/shops/${encodeURIComponent(id)}/verify`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as VerifyShopResponse;
}

export async function disconnectShop(id: string): Promise<Shop> {
  const res = await fetch(`/api/shops/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as Shop;
}
