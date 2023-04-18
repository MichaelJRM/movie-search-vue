import MovieSearchRepository from "~/models/movie/repository/movie-search-repository";
import {Paged} from "~/util/data/paged";
import {Result} from "~/util/data/result";

export default class MovieSearchUseCase {
  private repository: MovieSearchRepository;

  constructor(repository: MovieSearchRepository) {
    this.repository = repository;
  }

  async search(search: string, yearOfRelease: string | null, page: number): Promise<Result<Paged<MovieSearch>, any>> {
    return await this.repository.search(search, yearOfRelease, page);
  }

  async getDetails(imdbID: string): Promise<Result<MovieDetails, any>> {
    return await this.repository.getDetails(imdbID);
  }
}
