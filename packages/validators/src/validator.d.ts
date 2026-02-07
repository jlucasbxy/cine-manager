export interface Validator<T> {
  parse(data: unknown): T;
}
