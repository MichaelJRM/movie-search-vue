import {defineStore} from 'pinia';
import {ResultType} from '~/util/data/result';

export const useMovieDetailsStore = defineStore('movie-details', () => {
  const {$useCase} = useNuxtApp();
  const movieDetails = ref<MovieDetails>();
  const isLoading = ref<boolean>(false);
  const queryError = ref<string>('');
  let criticalError = ref<string>('');

  const getMovieDetails = computed<MovieDetails | undefined>(() => movieDetails.value);
  const getIsLoading = computed<boolean>(() => isLoading.value);
  const getQueryError = computed<string>(() => queryError.value);
  const getCriticalError = computed<string>(() => criticalError.value);

  const fetchMovieDetails = async (imdbID: string): Promise<void> => {
    criticalError.value = '';
    queryError.value = '';
    isLoading.value = true;
    await new Promise(res => setTimeout(res, 200));
    const result = await $useCase.movie.getDetails(imdbID);
    switch (result.type) {
      case ResultType.Success:
        movieDetails.value = result.data;
        break;
      case ResultType.QueryError:
        queryError.value = result.error;
        movieDetails.value = undefined;
        break;
      case ResultType.Failure:
        criticalError.value = 'An error occurred while trying to fetch the movie details, please check your connection and try again.';
        movieDetails.value = undefined;
        break;
    }
    isLoading.value = false;
  };

  const acknowledgeCriticalError = (): void => {
    criticalError.value = '';
  };

  return {
    getMovieDetails,
    getIsLoading,
    getCriticalError,
    getQueryError,
    fetchMovieDetails,
    acknowledgeCriticalError,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMovieDetailsStore, import.meta.hot));
}