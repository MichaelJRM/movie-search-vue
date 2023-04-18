import MovieSearchApi from "~/models/movie/repository/api/movie-search-api";
import {Paged} from "~/util/data/paged";
import RepositoryApiResultHandler from "~/util/repository/error-handler";
import {Result} from "~/util/data/result";

export default class MovieSearchRepository {
  private api: MovieSearchApi;

  constructor(api: MovieSearchApi) {
    this.api = api;
  }

  async search(query: string, yearOfRelease: string | null, page: number): Promise<Result<Paged<MovieSearch>, any>> {
    return RepositoryApiResultHandler.handle(async () => {
      return await this.api.search(query, yearOfRelease, page);
    });
  }

  async getDetails(imdbID: string): Promise<Result<MovieDetails, any>> {
    return RepositoryApiResultHandler.handle(async () => {
      return await this.api.getDetails(imdbID);
    });
  }
}
