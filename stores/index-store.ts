import {defineStore} from 'pinia';
import {ResultType} from '~/util/data/result';

const minSearchPaginationPage: number = 1;
const maxSearchPaginationPage: number = 100;

export const useIndexStore = defineStore('index', () => {
  const {$useCase} = useNuxtApp();
  const movies = ref<MovieSearch[]>([]);
  const currentSearchQuery = ref<string>('');
  const currentSelectedYearOfRelease = ref<string | null>('');
  const currentPage = ref<number>(1);
  const isLoading = ref<boolean>(false);
  const queryError = ref<string>('');
  const criticalError = ref<string>('');

  const getMovies = computed<MovieSearch[]>(() => movies.value);
  const getSearchQuery = computed<string>(() => currentSearchQuery.value);
  const getSelectedYearOfRelease = computed<string | null>(() => currentSelectedYearOfRelease.value);
  const getCurrentPage = computed<number>(() => currentPage.value);
  const getIsLoading = computed<boolean>(() => isLoading.value);
  const getQueryError = computed<string>(() => queryError.value);
  const getCriticalError = computed<string>(() => criticalError.value);

  const fetchMovies = async (search: string): Promise<void> => {
    criticalError.value = '';
    if (search.trim() !== currentSearchQuery.value) {
      currentPage.value = 1;
    }
    currentSearchQuery.value = search.trim();
    if (currentSearchQuery.value === '') {
      movies.value = [];
      queryError.value = '';
      return;
    }
    isLoading.value = true;
    const result = await $useCase.movie.search(
      currentSearchQuery.value,
      currentSelectedYearOfRelease.value,
      currentPage.value
    );
    switch (result.type) {
      case ResultType.Success:
        if (queryError.value !== '') {
          queryError.value = '';
        }
        movies.value = result.data.Search;
        break;
      case ResultType.QueryError:
        queryError.value = result.error;
        movies.value = [];
        break;
      case ResultType.Failure:
        criticalError.value = 'An error occurred while trying to fetch more movies, please check your connection and try again.';
        break;
    }
    isLoading.value = false;
  };

  const changeSelectedYearOfRelease = async (year: string | null): Promise<void> => {
    if (year != currentSelectedYearOfRelease.value) {
      currentPage.value = 1;
    }
    currentSelectedYearOfRelease.value = year;
    if (currentSearchQuery.value === '') return;
    await fetchMovies(currentSearchQuery.value);
  };

  const changePage = async (newPage: number): Promise<void> => {
    if (newPage < minSearchPaginationPage) return;
    if (newPage > maxSearchPaginationPage) return;
    currentPage.value = newPage;
    await fetchMovies(currentSearchQuery.value);
  };

  const resetSearch = (): void => {
    movies.value = [];
    currentSearchQuery.value = '';
    currentSelectedYearOfRelease.value = '';
    currentPage.value = 1;
    isLoading.value = false;
    queryError.value = '';
  };

  const acknowledgeCriticalError = (): void => {
    criticalError.value = '';
  };

  return {
    getMovies,
    getSearchQuery,
    getCurrentPage,
    getSelectedYearOfRelease,
    getIsLoading,
    getCriticalError,
    getQueryError,
    fetchMovies,
    changeSelectedYearOfRelease,
    changePage,
    resetSearch,
    acknowledgeCriticalError,
  };
});


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useIndexStore, import.meta.hot));
}