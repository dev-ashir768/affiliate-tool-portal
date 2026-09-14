export type PaginationItem = number | "ellipsis";

export function getPaginationItems(
  currentPage: number, // 1-based
  totalPages: number,
  siblingCount = 1,
): PaginationItem[] {
  if (totalPages <= 1) return totalPages === 1 ? [1] : [];
  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (
    let p = Math.max(1, currentPage - siblingCount);
    p <= Math.min(totalPages, currentPage + siblingCount);
    p++
  ) {
    pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const items: PaginationItem[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) items.push("ellipsis");
    items.push(p);
    prev = p;
  }
  return items;
}
