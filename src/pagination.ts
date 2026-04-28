export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function paginate<T>(
  items: T[],
  params: PaginationParams
): PaginatedResult<T> {
  const { page, perPage } = params;
  const total = items.length;
  const totalPages = Math.ceil(total / perPage);
  const offset = (page - 1) * perPage;
  const pageItems = items.slice(offset, offset + perPage);

  return {
    items: pageItems,
    total,
    page,
    perPage,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export function validatePaginationParams(input: {
  page?: unknown;
  perPage?: unknown;
}): PaginationParams {
  let page = Number(input.page);
  let perPage = Number(input.perPage);

  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(perPage) || perPage < 1) perPage = 20;
  if (perPage > 100) perPage = 100;

  return { page: Math.floor(page), perPage: Math.floor(perPage) };
}
