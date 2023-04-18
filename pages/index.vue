<template>
    <div class="p-4 sm:p-10 min-h-screen flex flex-col overflow-hidden place-items-center transition duration-150">
        <div :class="{'animate-pulse': (store.getMovies?.length ?? 0) == 0 && store.getIsLoading}"
             class="md:min-w-[40em]">
            <SearchBar
                    :current-page="store.getCurrentPage"
                    :search-query="store.getSearchQuery"
                    :year-of-release="store.getSelectedYearOfRelease"
                    @onNewPage="onNewPage"
                    @onNewSearchQuery="onNewSearchQuery"
                    @onNewYearOfRelease="onNewYearOfRelease"
            />
        </div>

        <div v-if="store.getQueryError && !store.getIsLoading"
             class="text-white mt-2 flex text-xs w-full flex-1 justify-center place-items-center">
            {{ store.getQueryError }}
        </div>

        <div v-if="store.getMovies && store.getMovies.length" :class="videosContainerClasses"
             class="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(200px,350px))] gap-2 sm:gap-4 mt-8 z-10 mb-60 w-full justify-center"
        >
            <VideoThumbnail v-for="(movie, index) in store.getMovies" :key="index" :movie="movie"/>
        </div>

        <div
                v-if="store.getIsLoading"
                class="grid place-items-center absolute top-1/2 left-1/2 text-white"
                style="transform: translate(-50%, 50%)"
        >
            <LoadingIndicator/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {useIndexStore} from "~/stores/index-store";

const store = useIndexStore();
const videosContainerClasses = ref<string[]>([]);
const videosContainerCSSAnimationClasses = ['translate-y-[500%]', 'duration-700'];
const videosContainerDefaultCSSAnimationClasses = ['translate-y-0', 'duration-700'];
let searchTimeout: NodeJS.Timeout;

async function onNewSearchQuery(query: string) {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    videosContainerClasses.value = videosContainerCSSAnimationClasses;
    await store.fetchMovies(query);
    videosContainerClasses.value = videosContainerDefaultCSSAnimationClasses;
  }, query ? 500 : 0);
}

async function onNewYearOfRelease(year: string | null) {
  if (searchTimeout) clearTimeout(searchTimeout);
  videosContainerClasses.value = videosContainerCSSAnimationClasses;
  await store.changeSelectedYearOfRelease(year);
  videosContainerClasses.value = videosContainerDefaultCSSAnimationClasses;
}

async function onNewPage(page: number) {
  videosContainerClasses.value = videosContainerCSSAnimationClasses;
  await store.changePage(page);
  videosContainerClasses.value = videosContainerDefaultCSSAnimationClasses;
}
</script>
