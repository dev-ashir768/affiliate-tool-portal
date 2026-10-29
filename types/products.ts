export type ShopProductSkuSummary = {
  id: string;
  sellerSku: string | null;
  status: string | null;
  priceAmount: string | null;
  priceCurrency: string | null;
  inventoryQuantity: number | null;
  warehouseId: string | null;
};

export type ShopProductSummary = {
  id: string;
  title: string | null;
  status: string | null;
  auditStatus: string | null;
  listingQualityTier: string | null;
  sellingFormat: string | null;
  isNotForSale: boolean | null;
  salesRegions: string[];
  createTime: number | null;
  updateTime: number | null;
  skus: ShopProductSkuSummary[];
  primarySellerSku: string | null;
  primaryPriceAmount: string | null;
  primaryPriceCurrency: string | null;
  totalInventory: number | null;
};

export type ShopProductsResponse = {
  products: ShopProductSummary[];
  nextPageToken: string | null;
};
