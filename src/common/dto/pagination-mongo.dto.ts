export class PaginationMongoDto<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}