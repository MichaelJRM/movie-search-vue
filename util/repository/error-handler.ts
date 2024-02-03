import {type Result, type ResultFailure, type ResultQueryError, type ResultSuccess, ResultType} from '~/util/data/result';

export default class RepositoryApiResultHandler {
  public static async handle<T>(body: () => Promise<T>): Promise<Result<T>> {
    try {
      const data = await body();
      // @ts-ignore
      if (data.Error) {
        return <ResultQueryError>{
          // @ts-ignore
          error: data.Error,
          type: ResultType.QueryError,
        };
      }
      return <ResultSuccess<T>>{
        data: data,
        type: ResultType.Success,
      };
    } catch (e) {
      return <ResultFailure>{
        error: e,
        type: ResultType.Failure,
      };
    }
  }
}