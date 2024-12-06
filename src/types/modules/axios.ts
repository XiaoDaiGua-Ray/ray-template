export interface BasicResponse<T> {
  data: T
  msg: string
  code: number
}

export interface PaginationResponse<T> extends BasicResponse<T> {
  total: number
}
