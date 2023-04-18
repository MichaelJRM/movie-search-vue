import HttpFactory from "~/util/api/factory";
import {Paged} from "~/util/data/paged";

export default class MovieSearchApi extends HttpFactory {
  async search(query: string, yearOfRelease: string | null, page: number): Promise<Paged<MovieSearch>> {
    return await this.call('get', '', undefined, {
      query: {
        s: query,
        type: 'movie',
        page: page.toString(),
        y: yearOfRelease
      }
    });
  }

  async getDetails(imdbID: string): Promise<MovieDetails> {
    return await this.call('get', '', undefined, {
      query: {
        i: imdbID,
        type: 'movie',
        plot: 'full'
      }
    });
  }
}
