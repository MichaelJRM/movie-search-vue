<template>
    <div class="p-10 min-h-screen flex flex-col overflow-hidden">
        <div :class="{'animate-pulse': (store.getMovies?.length ?? 0) == 0 && store.getIsLoading}"
             class="w-1/3 min-w-full md:min-w-[37em]">
            <SearchBar
                    :current-page="store.getCurrentPage"
                    :search-query="store.getSearchQuery"
                    @onNewPage="onNewPage"
                    @onNewSearchQuery="onNewSearchQuery"
            />
        </div>

        <div v-if="store.getQueryError && !store.getIsLoading"
             class="text-white mt-2 flex text-xs w-full flex-1 justify-center place-items-center">
            {{ store.getQueryError }}
        </div>

        <div class="relative">
            <div :class="videosContainerClasses"
                 class="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4 pt-8 z-10"
            >
                <VideoThumbnail v-for="movie in store.getMovies" :movie="movie"/>
            </div>
        </div>

        <div
                v-if="store.getIsLoading"
                class="grid place-content-center absolute top-1/2 left-1/2 text-white"
                style="transform: translate(-50%, -50%)"
        >
            <LoadingIndicator/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {useIndexStore} from "~/stores/index-store";

const store = useIndexStore();
const videosContainerClasses = ref<string[]>([]);
const videosContainerAnimationClasses = ['translate-y-[500%]', 'duration-700'];
let searchTimeout: NodeJS.Timeout;

async function onNewSearchQuery(query: string) {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    videosContainerClasses.value = videosContainerAnimationClasses;
    await store.fetchMovies(query);
    videosContainerClasses.value = ['translate-y-0', 'duration-700'];
  }, 500);
}

async function onNewPage(page: number) {
  videosContainerClasses.value = videosContainerAnimationClasses;
  await store.changePage(page);
  videosContainerClasses.value = ['translate-y-0', 'duration-700'];
}
</script>
