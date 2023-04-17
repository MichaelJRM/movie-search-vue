<template>
    <div ref="thumbnail"

         :class="thumbnailClasses"
         class="rounded-md shadow-md overflow-hidden hover:scale-125 transition duration-150 delay-0 motion-reduce:transition-none motion-reduce:hover:transform-none hover:duration-500 hover:delay-300"
    >
        <div class="flex flex-col min-h-[350px]">
            <img :src="props.movie.Poster"
                 alt="Video Thumbnail"
                 class="object-cover">
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ movie: MovieSearch }>();
const thumbnail = ref(null);
const thumbnailClasses = ref({'origin-left': false, 'origin-right': false});
const minSideDistanceToChangeOrigin = 60;

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
})

function handleResize() {
  const thumbnailRect = thumbnail.value.getBoundingClientRect();
  const screenWidth = window.innerWidth;
  thumbnailClasses.value['origin-left'] = thumbnailRect.left <= minSideDistanceToChangeOrigin;
  thumbnailClasses.value['origin-right'] = screenWidth - thumbnailRect.right <= minSideDistanceToChangeOrigin;
}
</script>
