<template>
    <div class="max-w-5xl bg-zinc-900/[.93] rounded-lg shadow-lg flex m-4 relative max-h-[70vh]" @click.stop>
        <template v-if="movieDetails">
            <div :style="isMobile ? `background-image: url('${movieDetails.Poster != 'N/A'? movieDetails.Poster : useImageAsset('default-movie-poster.jpg')}')` : ''"
                 class="absolute bg-no-repeat bg-cover bottom-0 left-0 top-0 right-0 -z-10 blur-md">
            </div>
            <div class="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2">
                <button @click="$emit('close')">
                    <Icon name="ic:baseline-cancel" size="2em" style="color: white"></Icon>
                </button>
            </div>
            <div class="poster overflow-hidden rounded-l-md min-w-fit aspect-[2/3] hidden md:block z-50">
                <img :alt="`${movieDetails.Title} Poster`"
                     :src="movieDetails.Poster != 'N/A'? movieDetails.Poster : useImageAsset('default-movie-poster.jpg')"
                     class="object-cover w-full h-full"
                >
            </div>
            <div class="text-white p-6 flex flex-col w-full sm:bg-none overflow-auto">
                <div class="space-y-2">
                    <div class="text-2xl font-bold">{{ movieDetails.Title }}
                        <span class="text-gray-300 ml-1">({{ movieDetails.Released }})</span>
                    </div>
                    <div>{{ movieDetails.Plot }}</div>
                </div>
                <div class="flex flex-col justify-between mt-10 h-full items-start md:flex-row">
                    <div class="flex flex-col space-y-2 h-full">
                        <div class="font-bold">Directors:
                            <span class="font-normal">{{ movieDetails.Director }}</span>
                        </div>
                        <div class="font-bold"> Writers: <span class="font-normal">{{ movieDetails.Writer }}</span>
                        </div>
                        <div class="flex space-x-4">
                            <div class="font-bold">IMDB Rating: <br>
                                <span class="font-normal">{{ movieDetails.imdbRating }}</span>
                            </div>
                            <div class="font-bold">IMDB Votes: <br>
                                <span class="font-normal">{{ movieDetails.imdbVotes }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="mt-2 md:mt-0 space-y-2">
                        <div v-for="(rating, index) in movieDetails.Ratings" :key="index">
                            <span class="font-semibold">{{ rating.Source }}</span>: {{ rating.Value }}
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div v-else class="grid place-content-center">
            <LoadingIndicator/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import useImageAsset from '~/composables/use-image-asset';
import {mobileBreakpoint} from '~/util/common/screen-break-points';

const props = defineProps<{
  movieDetails: MovieDetails | undefined;
}>();
const emit = defineEmits<{
  (e: 'close'): void;
}>();
const isMobile = ref<boolean>(window.innerWidth < mobileBreakpoint);

function handleResize() {
  isMobile.value = window.innerWidth < mobileBreakpoint;
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>