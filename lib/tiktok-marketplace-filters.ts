/**
 * Mirrors TikTok Seller Marketplace search filter enums (portal UI).
 * @see https://partner.tiktokshop.com/docv2/page/search-creators-in-creator-marketplace-202608
 */

export const TIKTOK_GMV_RANGES = [
  "GMV_RANGE_0_100",
  "GMV_RANGE_100_1000",
  "GMV_RANGE_1000_10000",
  "GMV_RANGE_10000_AND_ABOVE",
] as const;

export type TikTokGmvRange = (typeof TIKTOK_GMV_RANGES)[number];

export const TIKTOK_UNITS_SOLD_RANGES = [
  "UNITS_SOLD_RANGE_0_10",
  "UNITS_SOLD_RANGE_10_100",
  "UNITS_SOLD_RANGE_100_1000",
  "UNITS_SOLD_RANGE_1000_AND_ABOVE",
] as const;

export type TikTokUnitsSoldRange = (typeof TIKTOK_UNITS_SOLD_RANGES)[number];

export const TIKTOK_GMV_RANGE_OPTIONS = [
  { value: "", label: "Any GMV" },
  { value: "GMV_RANGE_0_100", label: "GMV $0–$100" },
  { value: "GMV_RANGE_100_1000", label: "GMV $100–$1K" },
  { value: "GMV_RANGE_1000_10000", label: "GMV $1K–$10K" },
  { value: "GMV_RANGE_10000_AND_ABOVE", label: "GMV $10K+" },
] as const;

export const TIKTOK_UNITS_SOLD_RANGE_OPTIONS = [
  { value: "", label: "Any units sold" },
  { value: "UNITS_SOLD_RANGE_0_10", label: "Units sold 0–10" },
  { value: "UNITS_SOLD_RANGE_10_100", label: "Units sold 10–100" },
  { value: "UNITS_SOLD_RANGE_100_1000", label: "Units sold 100–1K" },
  { value: "UNITS_SOLD_RANGE_1000_AND_ABOVE", label: "Units sold 1K+" },
] as const;
