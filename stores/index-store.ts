import {defineStore} from 'pinia';
import {ResultType} from "~/util/data/result";


export const useIndexStore = defineStore('index', () => {
  const {$useCase} = useNuxtApp();
  const movies = ref<MovieSearch[]>([]);
  const currentSearchQuery = ref<string>('');
  const currentPage = ref<number>(1);
  const isLoading = ref<boolean>(false);
  const queryError = ref<string>('');

  const getMovies = computed<MovieSearch[]>(() => movies.value);
  const getSearchQuery = computed<string>(() => currentSearchQuery.value);
  const getCurrentPage = computed<number>(() => currentPage.value);
  const getIsLoading = computed<boolean>(() => isLoading.value);
  const getQueryError = computed<string>(() => queryError.value);

  const fetchMovies = async (search: string) => {
    // currentSearchQuery.value = search.trim();
    currentSearchQuery.value = search.trim();

    if (currentSearchQuery.value === '') {
      movies.value = [];
      return;
    }
    isLoading.value = true;
    await new Promise(res => setTimeout(res, 1000));
    const result = await $useCase.movie.search(currentSearchQuery.value, currentPage.value);
    console.log(result);
    switch (result.type) {
      case ResultType.Success:
        if (result.data.hasOwnProperty('Error')) {
          queryError.value = result.data['Error'] as string;
          movies.value = [];
          break;
        } else if (queryError.value !== '') {
          queryError.value = '';
        }
        movies.value = result.data.Search;
        break;
      case ResultType.Failure:
        console.error(result.error);
        break;
    }
    isLoading.value = false;
  }

  const changePage = async (newPage: number) => {
    if (newPage < 1) return;
    currentPage.value = newPage;
    await fetchMovies(currentSearchQuery.value);
  }

  return {
    getMovies,
    getSearchQuery,
    getCurrentPage,
    getIsLoading,
    getQueryError,
    fetchMovies,
    changePage,
  }
});


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useIndexStore, import.meta.hot))
}