export interface PaginationOptions {
  page: number; // 0-indexed
  pageSize: number; // items per page
}

export function createPaginationOptions(
  page?: number,
  pageSize?: number
): PaginationOptions {
  return {
    page: page ?? 0,
    pageSize: pageSize ?? 20,
  };
}
