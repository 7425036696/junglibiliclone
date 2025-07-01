// src/types/pagination.ts or .d.ts

// Query props used in API calls (e.g., ?page=1&perPage=10)
export interface PaginationQueryProps {
  page: number;
  perPage?: number;
}

// Simplified pagination shape used across frontend
export interface PaginationProps {
  page: number;       // current page number
  pages: number;      // total pages
  perPage: number;    // items per page
  total: number;      // total items
}

// Full data + pagination
export interface PaginationData<T> {
  data: T[];
  pagination: PaginationProps;
}
