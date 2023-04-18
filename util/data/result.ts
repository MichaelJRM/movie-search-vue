export interface ResultSuccess<T> {
  data: T;
  type: ResultType.Success;
}

export interface ResultQueryError {
  error: string;
  type: ResultType.QueryError;
}

export interface ResultFailure {
  error: string;
  type: ResultType.Failure;
}

export type Result<T> = ResultSuccess<T> | ResultQueryError | ResultFailure

export enum ResultType {
  Success = 'success',
  Failure = 'failure',
  QueryError = 'queryError',
}