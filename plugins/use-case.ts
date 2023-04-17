import MovieSearchUseCase from "~/models/movie/use-case/movie-search-use-case";

interface IUseCaseInstance {
  movie: MovieSearchUseCase
}

export default defineNuxtPlugin((nuxtApp) => {
  const modules: IUseCaseInstance = {
    movie: new MovieSearchUseCase(nuxtApp.$repository.movie),
  }
  return {
    provide: {
      useCase: modules,
    }
  }
});