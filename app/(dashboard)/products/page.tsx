import { ProductsPageContent } from "@/components/products/products-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Products",
  description:
    "Browse and manage your TikTok Shop product catalog for affiliate campaigns and sample requests.",
});

export default function ProductsPage() {
  return <ProductsPageContent />;
}
