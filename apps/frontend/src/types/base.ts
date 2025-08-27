export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface ResponseWithPagination<T> {
  data: T[];
  pagination: Pagination;
}

export interface QueryParams extends Record<string, any> {}
