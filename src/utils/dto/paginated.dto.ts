interface IPaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

class PaginatedDto<TData> {
  items: TData[];
  meta: IPaginationMeta;
}

export { IPaginationMeta, PaginatedDto };