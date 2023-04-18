<template>
    <div ref="thumbnail" :class="thumbnailClasses"
         class=" thumbnail rounded-md shadow-md hover:scale-105 sm:hover:scale-125 transition duration-150 delay-0
             hover:duration-500 hover:delay-300 motion-reduce:transition-none motion-reduce:hover:transform-none cursor-pointer"
         @click="toggleExpanded"
    >
        <div class="poster overflow-hidden rounded-md h-full aspect-[2/3]">
            <img :src="props.movie.Poster != 'N/A' ? props.movie.Poster : useImageAsset('default-movie-poster.jpg')"
                 alt="Movie poster"
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
import useImageAsset from '~/composables/use-image-asset';
import Modal from '~/components/Modal.vue';
import DialogError from '~/components/dialog/Error.vue';

const props = defineProps<{ movie: MovieSearch }>();
const {isMobile} = useDevice();
const thumbnail = ref<HTMLInputElement | null>(null);
const thumbnailClasses = ref<{
  'origin-left': boolean;
  'origin-right': boolean;
}>({'origin-left': false, 'origin-right': false});
const isExpanded = ref<boolean>(false);
const store = useMovieDetailsStore();
const dialogError = ref<InstanceType<typeof DialogError> | null>(null);
const minSideDistanceToChangeOrigin = 60;


watchEffect(() => {
  if (store.getCriticalError) {
    dialogError.value?.show(store.getCriticalError);
    isExpanded.value = false;
  }
});


function handleResize() {
  const screenWidth = window.innerWidth;
  if (isMobile) {
    thumbnailClasses.value['origin-left'] = false;
    thumbnailClasses.value['origin-right'] = false;
    return;
  }
  const thumbnailRect = thumbnail.value?.getBoundingClientRect();
  if (!thumbnailRect) return;
  thumbnailClasses.value['origin-left'] = thumbnailRect.left <= minSideDistanceToChangeOrigin;
  thumbnailClasses.value['origin-right'] = screenWidth - thumbnailRect.right <= minSideDistanceToChangeOrigin;
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
</style>