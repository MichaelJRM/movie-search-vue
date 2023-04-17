import HttpFactory from "~/util/api/factory";
import {Paged} from "~/util/data/paged";

export default class MovieSearchApi extends HttpFactory {
  async search(query: string, page: number): Promise<Paged<MovieSearch>> {
    return await this.call("get", '', undefined, {
      query: {
        s: query,
        page: page.toString()
      }
    });
  }

  async details(id: string): Promise<MovieDetails> {
    return await this.call("get", '', undefined, {
      query: {
        i: id
      }
    });
  }
}
