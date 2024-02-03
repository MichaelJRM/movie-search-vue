<template>
    <div class="p-4 sm:p-10 min-h-screen flex flex-col overflow-hidden place-items-center transition duration-150">
        <div :class="{'animate-pulse': (store.getMovies?.length ?? 0) == 0 && store.getIsLoading}"
             class="sm:min-w-[min(40rem,_100%)] w-full sm:w-auto">
            <SearchBar
                    :current-page="store.getCurrentPageNumber"
                    :search-query="store.getSearchQuery"
                    :total-pages="store.getTotalPages"
                    :year-of-release="store.getYearOfRelease"
                    @newPage="onNewPage"
                    @newSearchQuery="onNewSearchQuery"
                    @newYearOfRelease="onNewYearOfRelease"
                    @reset="onResetSearch"
            />
        </div>
        <div v-if="store.getQueryError && !store.getIsLoading"
             class="text-white mt-2 flex text-sm w-full flex-1 justify-center place-items-center">
            {{ store.getQueryError }}
        </div>
        <div v-if="store.getMovies && store.getMovies.length" :class="videosContainerDynamicClasses"
             class="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(200px,280px))] gap-2 sm:gap-4 mt-8 z-10
             mb-32 w-full justify-center"
        >
            <MovieThumbnail v-for="(movie, index) in store.getMovies" :key="index" :movie="movie"/>
        </div>
        <div v-if="store.getIsLoading"
             class="grid place-items-center absolute top-1/2 left-1/2 text-white -translate-x-1/2 translate-y-1/2">
            <LoadingIndicator/>
        </div>
        <Pagination v-show="store.getSearchQuery" :current-page="store.getCurrentPageNumber"
                    :total-pages="store.getTotalPages" @newPage="onBottomPaginationNewPage"/>
        <DialogError ref="dialogError"/>
    </div>
</template>

<script lang="ts" setup>
import {useIndexStore} from '~/stores/index-store';
import DialogError from '~/components/dialog/Error.vue';
import Pagination from '~/components/Pagination.vue';
import wait from '~/util/common/wait';
import {storeToRefs} from 'pinia';
import type {LocationQuery, LocationQueryValue} from "vue-router";

const store = useIndexStore();
const dialogError = ref<InstanceType<typeof DialogError> | null>(null);
const videosContainerDynamicClasses = ref<string[]>([]);
const videosContainerCSSAnimationClasses = ['translate-y-[500%]', 'duration-700'];
const videosContainerDefaultCSSAnimationClasses = ['translate-y-0', 'duration-700'];
let searchTimeout: NodeJS.Timeout;
const searchTimeoutInMs = 700;
const {getCriticalError, getCurrentPageNumber, getSearchQuery, getYearOfRelease} = storeToRefs(store);
const router = useRouter();
const route = useRoute();

onMounted(() => {
  parseRouteQuery(route.query)
})

useHead({
  title: 'Movie Search',
  meta: [
    {
      name: 'description',
      content: 'Search for movies',
    },
  ],
});

watch(getCriticalError, (value) => {
  if (value) {
    dialogError.value?.show(value);
  }
});

watch(getSearchQuery, () => updateRouteQuery());
watch(getYearOfRelease, () => updateRouteQuery());
watch(getCurrentPageNumber, () => updateRouteQuery());

function updateRouteQuery() {
  let query = {
    q: store.getSearchQuery,
    p: store.getCurrentPageNumber
  }
  if (store.getYearOfRelease) {
    query.y = store.getYearOfRelease
  }
  router.push({
    path: '/',
    query: query
  })
}

async function parseRouteQuery(params: LocationQuery) {
  const searchQuery = params.q as LocationQueryValue;
  if (!searchQuery) return;

  const pageNumber = params.p as LocationQueryValue;
  const year = params.y as LocationQueryValue;


  await applyVideoContainerAnimation(() => store.fetchMovies(
      searchQuery,
      year ?? null,
      parseInt(pageNumber as string) ?? 0)
  );
}

async function onNewSearchQuery(searchQuery: string) {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(async () => {
    await applySearchQuery(searchQuery)
  }, searchQuery ? searchTimeoutInMs : 0);
}

async function applySearchQuery(searchQuery: string) {
  await applyVideoContainerAnimation(() => store.fetchMovies(searchQuery, store.getYearOfRelease, store.getCurrentPageNumber));
}

async function onNewYearOfRelease(year: string | null) {
  if (searchTimeout) clearTimeout(searchTimeout);
  await applyVideoContainerAnimation(() => store.changeYearOfRelease(year));
}

async function onNewPage(page: number) {
  await applyVideoContainerAnimation(() => store.changePageNumber(page));
}

async function onBottomPaginationNewPage(page: number) {
  if (document.documentElement.scrollTop != 0) {
    window.scrollTo({top: 0, behavior: 'smooth'});
    await wait(300);
  }

  await onNewPage(page);
}

async function onResetSearch() {
  await applyVideoContainerAnimation(store.resetSearch);
}

async function applyVideoContainerAnimation(callback: () => Promise<void>) {
  videosContainerDynamicClasses.value = videosContainerCSSAnimationClasses;
  await callback();
  videosContainerDynamicClasses.value = videosContainerDefaultCSSAnimationClasses;
}
</script>
