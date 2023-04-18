<template>
    <div class="flex flex-row w-full justify-center">
        <button v-if="searchQuery"
                class="ml-5 rounded-md min-w-fit w-16 bg-gray-100 flex justify-center items-center hover:scale-105 transition duration-150"
                @click="$emit('onNewSearchQuery', '')">
            <Icon name="ic:baseline-clear"></Icon>
        </button>
        <input
                :value="searchQuery"
                class="
                ml-1 w-full border-1 border-gray-300 focus:border-gray-300 focus:outline-none focus-visible:ring-0
                active:border-gray-300 active:enabled:hover:border-gray-300 p-1 pl-2 rounded-md bg-gray-100
                placeholder:italic placeholder:text-slate-800 text-base"
                placeholder="Search for a movie by title"
                type="text"
                @input="$emit('onNewSearchQuery', $event.target.value)"
        >
        <select
                :value="yearOfRelease"
                class="ml-5 form-select rounded-md border-1 border-gray-300 focus:border-gray-300 focus:outline-none
                 focus-visible:ring-0 active:border-gray-300 active:enabled:hover:border-gray-300"
                @input="$emit('onNewYearOfRelease', $event.target.value)">
            <option value="">All years</option>
            <option v-for="year in generateYears()" :key="year" :value="year">{{ year }}</option>
        </select>
        <template v-if="searchQuery">
            <button class="ml-5 rounded-md min-w-fit w-16 bg-gray-100 flex justify-center items-center hover:scale-105 transition duration-150"
                    @click="emitDecrementPage">
                <Icon name="ic:baseline-arrow-back"></Icon>
            </button>
            <div class="ml-1 rounded-md min-w-fit w-16 bg-gray-100 flex justify-center items-center text-sm">
                {{ currentPage }}
            </div>
            <button class="ml-1 rounded-md min-w-fit w-16 bg-gray-100 flex justify-center items-center hover:scale-105 transition duration-150"
                    @click="emitIncrementPage">
                <Icon name="ic:baseline-arrow-forward"></Icon>
            </button>
        </template>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  searchQuery: string,
  yearOfRelease: string | null,
  currentPage: number
}>();
const emit = defineEmits([
  'onNewSearchQuery',
  'onNewYearOfRelease',
  'onNewPage'
]);
const minYear = 1900;

function emitIncrementPage() {
  emit('onNewPage', props.currentPage + 1);
}

function emitDecrementPage() {
  emit('onNewPage', props.currentPage - 1);
}

function generateYears() {
  return Array(new Date().getFullYear() + 1 - minYear).fill(minYear).map((x, y) => x + y).reverse();
}
</script>
