<template>
    <div class="flex flex-row w-full justify-center">
        <input
                :value="searchQuery"
                class="w-full border-1 border-gray-300 p-1 pl-2 rounded-md bg-amber-50 placeholder:italic placeholder:text-slate-400 text-sm"
                placeholder="Search for a movie by title"
                type="text"
                @input="$emit('onNewSearchQuery', $event.target.value)"
        >
        <template v-if="searchQuery">
            <button class="ml-5 rounded-md w-12 bg-amber-50 flex justify-center items-center hover:scale-105"
                    @click="decrementPage">
                <Icon name="ic:baseline-arrow-back"></Icon>
            </button>
            <div class="ml-1 rounded-md w-12 bg-amber-50 flex justify-center items-center text-sm">
                {{ currentPage }}
            </div>
            <button class="ml-1 rounded-md w-12 bg-amber-50 flex justify-center items-center hover:scale-105"
                    @click="incrementPage">
                <Icon name="ic:baseline-arrow-forward"></Icon>
            </button>
        </template>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  searchQuery: string,
  currentPage: number
}>();
const emit = defineEmits([
  'onNewSearchQuery',
  'onNewPage'
]);

function incrementPage() {
  emit('onNewPage', props.currentPage + 1);
}

function decrementPage() {
  emit('onNewPage', props.currentPage - 1);
}

</script>
