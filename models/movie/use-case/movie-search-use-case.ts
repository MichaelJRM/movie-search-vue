import MovieSearchRepository from '~/models/movie/repository/movie-search-repository';
import {Paged} from '~/util/data/paged';
import type {Result} from '~/util/data/result';
import type {MovieSearch, MovieDetails} from '~/models/movie/entity/movie';

export default class MovieSearchUseCase {
  constructor(private readonly repository: MovieSearchRepository) {
  }

  async search(search: string, yearOfRelease: string | null, page: number): Promise<Result<Paged<MovieSearch>>> {
    return await this.repository.search(search, yearOfRelease, page);
  }

  async getDetails(imdbID: string): Promise<Result<MovieDetails>> {
    return await this.repository.getDetails(imdbID);
  }
}
