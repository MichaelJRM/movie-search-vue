import {defineStore} from 'pinia';
import {ResultType} from '~/util/data/result';

const minSearchPaginationPage: number = 1;
const maxSearchPaginationPage: number = 100;
const maxResultsPerPage: number = 10;

export const useIndexStore = defineStore('index', () => {
  const {$useCase} = useNuxtApp();
  const movies = ref<MovieSearch[]>([]);
  const currentSearchQuery = ref<string>('');
  const currentYearOfRelease = ref<string | null>(null);
  const currentPageNumber = ref<number>(1);
  const totalResults = ref<number>(0);
  const isLoading = ref<boolean>(false);
  const queryError = ref<string>('');
  const criticalError = ref<string>('');

  const getMovies = computed<MovieSearch[]>(() => movies.value);
  const getSearchQuery = computed<string>(() => currentSearchQuery.value);
  const getYearOfRelease = computed<string | null>(() => currentYearOfRelease.value);
  const getCurrentPageNumber = computed<number>(() => currentPageNumber.value);
  const getTotalPages = computed<number>(() => Math.ceil(totalResults.value / maxResultsPerPage));
  const getIsLoading = computed<boolean>(() => isLoading.value);
  const getQueryError = computed<string>(() => queryError.value);
  const getCriticalError = computed<string>(() => criticalError.value);

  const fetchMovies = async (searchQuery: string, yearOfRelease: string | null, pageNumber: number): Promise<void> => {
    criticalError.value = '';
    queryError.value = '';
    let previousSearchQuery = currentSearchQuery.value;
    let previousYearOfRelease = currentYearOfRelease.value;
    let previousPageNumber = currentPageNumber.value;
    let newSearchQuery = searchQuery.trim();
    let newYearOfRelease = yearOfRelease;
    let newPageNumber = pageNumber;

    if (newSearchQuery !== previousSearchQuery) {
      newPageNumber = 1;
    }
    if (newSearchQuery === '') {
      movies.value = [];
      currentPageNumber.value = 1;
      return;
    }

    currentSearchQuery.value = newSearchQuery;
    currentYearOfRelease.value = yearOfRelease;
    currentPageNumber.value = newPageNumber;
    isLoading.value = true;

    const result = await $useCase.movie.search(
      newSearchQuery,
      yearOfRelease,
      newPageNumber
    );
    switch (result.type) {
      case ResultType.Success:
        movies.value = result.data.Search;
        totalResults.value = result.data.totalResults;
        break;
      case ResultType.QueryError:
        queryError.value = result.error;
        movies.value = [];
        totalResults.value = 0;
        break;
      case ResultType.Failure:
        newSearchQuery = previousSearchQuery;
        newYearOfRelease = previousYearOfRelease;
        newPageNumber = previousPageNumber;
        criticalError.value = 'An error occurred while trying to fetch more movies, please check your connection and try again.';
        break;
    }
    currentSearchQuery.value = newSearchQuery;
    currentYearOfRelease.value = newYearOfRelease;
    currentPageNumber.value = newPageNumber;
    isLoading.value = false;
  };

  const changeYearOfRelease = async (year: string | null): Promise<void> => {
    const newPageNumber = year != currentYearOfRelease.value ? 1 : currentPageNumber.value;
    if (!currentSearchQuery.value) {
      currentYearOfRelease.value = year;
      return;
    }
    await fetchMovies(currentSearchQuery.value, year, newPageNumber);
  };

  const changePageNumber = async (newPage: number): Promise<void> => {
    if (newPage < minSearchPaginationPage) return;
    if (newPage > maxSearchPaginationPage) return;
    if (newPage > getTotalPages.value) return;
    await fetchMovies(currentSearchQuery.value, currentYearOfRelease.value, newPage);
  };

  const resetSearch = (): void => {
    movies.value = [];
    currentSearchQuery.value = '';
    currentYearOfRelease.value = null;
    currentPageNumber.value = 1;
    isLoading.value = false;
    queryError.value = '';
  };


  return {
    getMovies,
    getSearchQuery,
    getCurrentPageNumber,
    getTotalPages,
    getYearOfRelease,
    getIsLoading,
    getCriticalError,
    getQueryError,
    fetchMovies,
    changeYearOfRelease,
    changePageNumber,
    resetSearch,
  };
});


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useIndexStore, import.meta.hot));
}