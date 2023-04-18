<template>
    <div ref="thumbnail" :class="thumbnailClasses" class="
             thumbnail rounded-md shadow-md hover:scale-105 sm:hover:scale-125 transition duration-150 delay-0
             hover:duration-500 hover:delay-300 motion-reduce:transition-none motion-reduce:hover:transform-none cursor-pointer
        "
         @click="toggleExpanded"
    >
        <div class="poster overflow-hidden rounded-md h-full aspect-[2/3]">
            <img :src="props.movie.Poster != 'N/A' ? props.movie.Poster : useImageAsset('default-movie-poster.jpg')"
                 alt="Video Thumbnail"
                 class="object-cover w-full h-full"
            >
        </div>
        <div class="info-wrapper">
            <div class="bg-zinc-800 p-3 sm:p-5 rounded-b-md text-white shadow-md flex flex-col">
                <div class="text-sm font-semibold">{{ props.movie.Title }}</div>
                <div class="mt-2 text-xs md:text-sm font-semibold text-gray-400">{{ props.movie.Year }}</div>
            </div>
        </div>
        <Modal :is-open="isExpanded && store.getIsLoading" @closeRequested="closeMovieDetailsModal">
            <div class="grid place-items-center h-60 w-2/4">
                <LoadingIndicator class="text-white"/>
            </div>
        </Modal>
        <Modal :is-open="isExpanded && !store.getIsLoading" @closeRequested="closeMovieDetailsModal">
            <MovieDetails :movie-details="store.getMovieDetails" @close="toggleExpanded"/>
        </Modal>
    </div>
</template>

<script lang="ts" setup>
import {useVideoThumbnailStore} from "~/stores/video-thumbnail-store";
import useImageAsset from '~/composables/use-image-asset'
import Modal from "~/components/Modal.vue";

const props = defineProps<{ movie: MovieSearch }>();
const thumbnail = ref(null);
const thumbnailClasses = ref({'origin-left': false, 'origin-right': false});
const minSideDistanceToChangeOrigin = 60;
const isExpanded = ref<boolean>(false);
const store = useVideoThumbnailStore();
const mobileWidthBreakpoint = 639;


function handleResize() {
  const thumbnailRect = thumbnail.value.getBoundingClientRect();
  const screenWidth = window.innerWidth;
  if (screenWidth < mobileWidthBreakpoint) {
    thumbnailClasses.value['origin-left'] = false;
    thumbnailClasses.value['origin-right'] = false;
    return;
  }
  thumbnailClasses.value['origin-left'] = thumbnailRect.left <= minSideDistanceToChangeOrigin;
  thumbnailClasses.value['origin-right'] = screenWidth - thumbnailRect.right <= minSideDistanceToChangeOrigin;
}

async function toggleExpanded() {
  isExpanded.value = !isExpanded.value;
  console.log(isExpanded.value);
  if (isExpanded.value) {
    await store.fetchMovieDetails(props.movie.imdbID);
  }
}

function closeMovieDetailsModal() {
  isExpanded.value = false;
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
})

</script>
<style lang="scss" scoped>
.thumbnail {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
}

.info-wrapper {
  opacity: 0;
  height: 0;
  visibility: hidden;
  transition: opacity 0ms 0ms, display 0ms 0ms, height 0ms 0ms;
}

.thumbnail:hover .info-wrapper {
  opacity: 1;
  visibility: visible;
  transition: opacity 300ms 300ms, display 300ms 300ms, height 300ms 300ms;
}


.info-wrapper:hover .info-wrapper {
  opacity: 1;
  visibility: visible;
  transition: opacity 300ms 300ms, display 300ms 300ms, height 300ms 300ms;
}

.thumbnail:hover .poster {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  transition: border-bottom-left-radius 300ms 300ms, border-bottom-right-radius 300ms 300ms;
}
</style>