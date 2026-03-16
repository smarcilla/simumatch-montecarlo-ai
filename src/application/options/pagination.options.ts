import type { PaginationOptions } from "@/domain/types/pagination";

export function createPaginationOptions(
  page?: number,
  pageSize?: number
): PaginationOptions {
  return {
    page: page ?? 0,
    pageSize: pageSize ?? 20,
  };
}
