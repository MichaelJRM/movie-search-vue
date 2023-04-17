import MovieSearchApi from "~/models/movie/repository/api/movie-search-api";
import {FetchOptions} from "ohmyfetch";

interface IApiInstance {
  movie: MovieSearchApi
}

export default defineNuxtPlugin((nuxtApp) => {
  const fetchOptions: FetchOptions = {
    baseURL: `${nuxtApp.$config.public.apiBase}`,
    onRequest({options}): Promise<void> | void {
      options.query = options.query ?? {};
      options.query.apikey = nuxtApp.$config.public.apiKey;
    }
  }

  const apiFetcher = $fetch.create(fetchOptions);
  const modules: IApiInstance = {
    movie: new MovieSearchApi(apiFetcher),
  }
  return {
    provide: {
      api: modules,
    }
  }
});