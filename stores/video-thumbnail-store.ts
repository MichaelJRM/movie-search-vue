import {defineStore} from "pinia";
import {ResultType} from "~/util/data/result";
import {useIndexStore} from "~/stores/index-store";

export const useVideoThumbnailStore = defineStore('video-thumbnail', () => {
  const {$useCase} = useNuxtApp();
  const movieDetails = ref<MovieDetails>();
  const isLoading = ref<boolean>(false);
  const queryError = ref<string>('');

  const getMovieDetails = computed<MovieDetails>(() => movieDetails.value);
  const getIsLoading = computed<boolean>(() => isLoading.value);
  const getQueryError = computed<string>(() => queryError.value);

  const fetchMovieDetails = async (imdbID: string) => {
    isLoading.value = true;
    await new Promise(res => setTimeout(res, 200));
    const result = await $useCase.movie.getDetails(imdbID);
    switch (result.type) {
      case ResultType.Success:
        if (result.data.hasOwnProperty('Error')) {
          queryError.value = result.data['Error'] as string;
          movieDetails.value = undefined;
          break;
        } else if (queryError.value !== '') {
          queryError.value = '';
        }
        movieDetails.value = result.data;
        break;
      case ResultType.Failure:
        console.error(result.error);
        break;
    }
    isLoading.value = false;
  }

  return {
    getMovieDetails,
    getIsLoading,
    getQueryError,
    fetchMovieDetails
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useIndexStore, import.meta.hot))
}