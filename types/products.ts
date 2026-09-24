export type ShopProductSummary = {
  id: string;
  title: string | null;
  status: string | null;
};

export type ShopProductsResponse = {
  products: ShopProductSummary[];
  nextPageToken: string | null;
};
