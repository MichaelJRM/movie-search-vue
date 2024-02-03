import MovieSearchApi from '~/models/movie/repository/api/movie-search-api';
import {Paged} from '~/util/data/paged';
import RepositoryApiResultHandler from '~/util/repository/error-handler';
import type {Result} from '~/util/data/result';

export default class MovieSearchRepository {
  constructor(private readonly api: MovieSearchApi) {
  }

  async search(query: string, yearOfRelease: string | null, page: number): Promise<Result<Paged<MovieSearch>>> {
    return RepositoryApiResultHandler.handle(async () => {
      return await this.api.search(query, yearOfRelease, page);
    });
  }

  async getDetails(imdbID: string): Promise<Result<MovieDetails>> {
    return RepositoryApiResultHandler.handle(async () => {
      return await this.api.getDetails(imdbID);
    });
  }
}
