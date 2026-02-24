export class PaginatedResult<T> {
  readonly items: T[];
  readonly nextCursor: string | null;
  readonly hasNextPage: boolean;

  private constructor(items: T[], nextCursor: string | null, hasNextPage: boolean) {
    this.items = items;
    this.nextCursor = nextCursor;
    this.hasNextPage = hasNextPage;
  }

  static create<T>(items: T[], nextCursor: string | null, hasNextPage: boolean): PaginatedResult<T> {
    return new PaginatedResult(items, nextCursor, hasNextPage);
  }
}
