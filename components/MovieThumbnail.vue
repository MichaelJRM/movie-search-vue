<template>
    <div ref="thumbnail"
         :class="thumbnailClasses"
         class="thumbnail rounded-md shadow-md hover:scale-105 sm:hover:scale-125 transition duration-150 delay-0
             hover:duration-500 hover:delay-300 motion-reduce:transition-none motion-reduce:hover:transform-none
             cursor-pointer"
         @click="toggleExpanded"
    >
        <div class="poster overflow-hidden rounded-md h-full aspect-[2/3]">
            <img :alt="`${props.movie.Title} poster`"
                 :src="props.movie.Poster != 'N/A' ? props.movie.Poster : loadImageAsset('default-movie-poster.jpg')"
                 class="object-cover w-full h-full"
            >
        </div>
        <div class="info-wrapper">
            <div class="bg-zinc-800 p-3 sm:p-5 rounded-b-md text-white shadow-md flex flex-col">
                <div class="text-sm font-semibold" title="Movie title">{{ props.movie.Title }}</div>
                <div class="mt-2 text-xs md:text-sm font-semibold text-gray-400" title="Movie year of release">
                    {{ props.movie.Year }}
                </div>
            </div>
        </div>
        <Modal :is-open="isExpanded && store.getIsLoading"
               @closeRequested="isExpanded = false">
            <div class="grid place-items-center h-60 w-2/4">
                <LoadingIndicator class="text-white"/>
            </div>
        </Modal>
        <Modal :is-open="isExpanded && !store.getIsLoading"
               @closeRequested="isExpanded = false">
            <MovieDetails :movie-details="store.getMovieDetails" @close="isExpanded = false"/>
        </Modal>
        <DialogError ref="dialogError"/>
    </div>
</template>

<script lang="ts" setup>
import {useMovieDetailsStore} from '~/stores/movie-details-store';
import Modal from '~/components/Modal.vue';
import DialogError from '~/components/dialog/Error.vue';
import loadImageAsset from '~/util/common/load-image-asset';
import {storeToRefs} from 'pinia';

const props = defineProps<{ movie: MovieSearch }>();
const {isMobile} = useDevice();
const thumbnail = ref<HTMLInputElement | null>(null);
const thumbnailClasses = ref<string[]>();
const isExpanded = ref<boolean>(false);
const store = useMovieDetailsStore();
const dialogError = ref<InstanceType<typeof DialogError> | null>(null);
const minSideDistanceToChangeOrigin = 60;
const {getCriticalError} = storeToRefs(store);


watch(getCriticalError, (value) => {
  if (store.getCriticalError) {
    dialogError.value?.show(value);
    isExpanded.value = false;
  }
});

function handleResize() {
  setThumbnailOriginBasedOnDistanceToScreenEdges();
}

function setThumbnailOriginBasedOnDistanceToScreenEdges() {
  const screenWidth = window.innerWidth;
  thumbnailClasses.value = [];
  if (isMobile) {
    return;
  }
  const thumbnailRect = thumbnail.value?.getBoundingClientRect();
  if (!thumbnailRect) return;
  if (thumbnailRect.left <= minSideDistanceToChangeOrigin) {
    thumbnailClasses.value.push('origin-left');
  }
  if (screenWidth - thumbnailRect.right <= minSideDistanceToChangeOrigin) {
    thumbnailClasses.value.push('origin-right');
  }
}

async function toggleExpanded() {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    await store.fetchMovieDetails(props.movie.imdbID);
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

</script>
<style lang="scss" scoped>
@media (hover: none) {
  .info-wrapper {
    display: none;
  }
}

@media (hover: hover) {
  .info-wrapper {
    opacity: 0;
    height: 0;
    visibility: hidden;
    transition: opacity 0ms 0ms, display 0ms 0ms, height 0ms 0ms;
  }

  %info-wrapper-on-hover {
    opacity: 1;
    visibility: visible;
    transition: opacity 300ms 300ms, display 300ms 300ms, height 300ms 300ms;
    transform: translateY(-1px);
  }

  .thumbnail:hover .info-wrapper {
    @extend %info-wrapper-on-hover;
  }

  .info-wrapper:hover .info-wrapper {
    @extend %info-wrapper-on-hover;
  }

  .thumbnail:hover .poster {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    transition: border-bottom-left-radius 300ms 300ms, border-bottom-right-radius 300ms 300ms;
  }
}
</style>