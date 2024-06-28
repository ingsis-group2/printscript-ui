export type Pagination = {
  page: number,
  page_size: number,
  count: number
}

export const paginationParams = (page: number) => `page=${page}`
