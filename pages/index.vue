<template>
    <div class="p-4 sm:p-10 min-h-screen flex flex-col overflow-hidden place-items-center transition duration-150">
        <div :class="{'animate-pulse': (store.getMovies?.length ?? 0) == 0 && store.getIsLoading}"
             class="sm:min-w-[min(40rem,_100%)] w-full sm:w-auto">
            <SearchBar
                    :current-page="store.getCurrentPage"
                    :search-query="store.getSearchQuery"
                    :total-pages="store.getTotalPages"
                    :year-of-release="store.getSelectedYearOfRelease"
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
             class="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(200px,350px))] gap-2 sm:gap-4 mt-8 z-10
             mb-32 w-full justify-center"
        >
            <MovieThumbnail v-for="(movie, index) in store.getMovies" :key="index" :movie="movie"/>
        </div>
        <div v-if="store.getIsLoading"
             class="grid place-items-center absolute top-1/2 left-1/2 text-white -translate-x-1/2 translate-y-1/2">
            <LoadingIndicator/>
        </div>
        <Pagination v-show="store.getSearchQuery" :current-page="store.getCurrentPage"
                    :total-pages="store.getTotalPages" @newPage="onBottomPaginationNewPage"/>
        <DialogError ref="dialogError"/>
    </div>
</template>

<script lang="ts" setup>
import {useIndexStore} from '~/stores/index-store';
import DialogError from '~/components/dialog/Error.vue';
import Pagination from '~/components/Pagination.vue';
import wait from '~/util/common/wait';

const store = useIndexStore();
const dialogError = ref<InstanceType<typeof DialogError> | null>(null);
const videosContainerDynamicClasses = ref<string[]>([]);
const videosContainerCSSAnimationClasses = ['translate-y-[500%]', 'duration-700'];
const videosContainerDefaultCSSAnimationClasses = ['translate-y-0', 'duration-700'];
let searchTimeout: number | undefined;
const searchTimeoutInMs = 700;


useHead({
  title: 'Movie Search',
  meta: [
    {
      name: 'description',
      content: 'Search for movies',
    },
  ],
});

watchEffect(() => {
  if (store.getCriticalError) {
    dialogError.value?.show(store.getCriticalError);
  }
});

async function onNewSearchQuery(query: string) {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(async () => {
    await applyVideoContainerAnimation(() => store.fetchMovies(query));
  }, query ? searchTimeoutInMs : 0);
}

async function onNewYearOfRelease(year: string | null) {
  if (searchTimeout) clearTimeout(searchTimeout);
  await applyVideoContainerAnimation(() => store.changeSelectedYearOfRelease(year));
}

async function onNewPage(page: number) {
  await applyVideoContainerAnimation(() => store.changePage(page));
}

async function onBottomPaginationNewPage(page: number) {
  window.scrollTo({top: 0, behavior: 'smooth'});
  await wait(300);
  await onNewPage(page);
}

async function onResetSearch() {
  await applyVideoContainerAnimation(store.resetSearch);
}

async function applyVideoContainerAnimation(callback: () => void) {
  videosContainerDynamicClasses.value = videosContainerCSSAnimationClasses;
  await callback();
  videosContainerDynamicClasses.value = videosContainerDefaultCSSAnimationClasses;
}
</script>
