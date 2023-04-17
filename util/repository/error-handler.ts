import {Result, ResultType} from "~/util/data/result";

export default class RepositoryApiResultHandler {
  public static async handle<T>(body: () => Promise<T>): Promise<Result<T, any>> {
    try {
      return {
        data: await body(),
        type: ResultType.Success,
      }
    } catch (e) {
      return {
        error: e,
        type: ResultType.Failure,
      }
    }
  }
}