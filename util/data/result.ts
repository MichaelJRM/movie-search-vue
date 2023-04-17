export interface ResultSuccess<T> {
  data: T;
  type: ResultType.Success;
}

export interface ResultFailure<E> {
  error: E;
  type: ResultType.Failure;
}

export type Result<T, E> = ResultSuccess<T> | ResultFailure<E>

export enum ResultType {
  Success = 'success',
  Failure = 'failure',
}