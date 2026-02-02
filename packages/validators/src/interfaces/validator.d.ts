export interface Validator<T, K = Record<string, unknown>> {
  parse(data: K): T;
}
