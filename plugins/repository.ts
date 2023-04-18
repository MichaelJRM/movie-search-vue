import MovieSearchRepository from '~/models/movie/repository/movie-search-repository';

interface IRepositoryInstance {
  movie: MovieSearchRepository;
}

export default defineNuxtPlugin((nuxtApp) => {
  const modules: IRepositoryInstance = {
    // @ts-ignore
    movie: new MovieSearchRepository(nuxtApp.$api.movie),
  };
  return {
    provide: {
      repository: modules,
    }
  };
});