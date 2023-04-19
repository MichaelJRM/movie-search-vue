<template>
    <div class="flex flex-row justify-center space-x-2 h-11 mt-auto">
        <button
                :class="{ 'hover:scale-105': currentPage !== 1, '!bg-zinc-800/[.50]': currentPage === 1}"
                :disabled="currentPage === 1"
                class="rounded-md border border-zinc-700 min-w-fit w-16 bg-zinc-800 flex justify-center items-center transition duration-150 text-white"
                title="Go to previous page"
                type="button"
                @click="$emit('newPage', currentPage - 1)"
        >
            <Icon name="ic:baseline-arrow-back"></Icon>
        </button>
        <div class="rounded-md border border-zinc-700 min-w-fit w-8 bg-zinc-800 flex justify-center items-center text-sm text-white"
             title="The current page">
            {{ currentPage }}
        </div>
        <button :class="{ 'hover:scale-105': currentPage !== totalPages, '!bg-zinc-800/[.50]': currentPage === totalPages}"
                :disabled="currentPage === totalPages"
                class="rounded-md border border-zinc-700 min-w-fit w-16 bg-zinc-800 flex justify-center items-center transition duration-150 text-white"
                title="Go to next page"
                type="button"
                @click="$emit('newPage', currentPage + 1)"
        >
            <Icon name="ic:baseline-arrow-forward"></Icon>
        </button>
    </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  currentPage: number,
  totalPages: number,
}>(), {
  currentPage: 1,
  totalPages: 1,
});
const emit = defineEmits<{
  (e: 'newPage', page: number): void;
}>();
</script>

<style scoped>

</style>