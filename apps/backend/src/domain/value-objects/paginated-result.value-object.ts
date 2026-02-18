import { NonNegativeInt } from "@/domain/value-objects/non-negative-int.value-object";

export class PaginatedResult<T> {
  readonly items: T[];
  readonly total: NonNegativeInt;

  private constructor(items: T[], total: NonNegativeInt) {
    this.items = items;
    this.total = total;
  }

  static create<T>(items: T[], total: number): PaginatedResult<T> {
    return new PaginatedResult(items, NonNegativeInt.create(total));
  }
}
