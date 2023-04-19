<template>
    <div class="flex flex-col sm:flex-row w-full justify-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div class="flex flex-row justify-center space-x-2 w-full h-11">
            <label class="relative block w-full">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon name="ic:baseline-search" size="1.2em" style="color: white"></Icon>
                </span>
                <input
                        :class="{'!pr-14': !!searchQuery}"
                        :value="searchQuery"
                        aria-autocomplete="none"
                        class="
                            block w-full h-full border border-zinc-700 focus:border-zinc-200 focus:outline-none focus-visible:ring-0
                            active:border-zinc-700 active:enabled:hover:autofill:border-zinc-700 py-2 pl-9 pr-2 rounded-md bg-zinc-900
                            placeholder:italic placeholder:text-zinc-200 text-base text-white
                        "
                        name="search"
                        placeholder="Search for a movie by title"
                        type="text"
                        @input="$emit('newSearchQuery', $event.target.value)"
                >
                <span class="absolute inset-y-0 right-0 flex items-center pr-2 py-2">
                     <button v-if="searchQuery"
                             class="rounded-md h-full border border-zinc-700 min-w-fit w-10 flex justify-center items-center hover:scale-105 transition duration-150 bg-zinc-800 text-white"
                             title="Reset search"
                             @click="$emit('reset')"
                     >
                        <Icon name="ic:baseline-clear"></Icon>
                    </button>
                </span>
            </label>

        </div>
        <div class="flex flex-row justify-center space-x-2 w-full h-11">
            <select
                    :class="{'min-w-full': !searchQuery}"
                    :value="yearOfRelease"
                    class="form-select rounded-md border border-zinc-700 focus:border-zinc-200 focus:outline-none
                    focus-visible:ring-0 active:border-zinc-700 active:enabled:hover:border-zinc-700 bg-zinc-800 text-white"
                    title="Filter by year of release"
                    @input="$emit('newYearOfRelease', $event.target.value)"
            >
                <option value="">All years</option>
                <option v-for="year in generateAvailableYears()" :key="year" :value="year">{{ year }}</option>
            </select>
            <template v-if="searchQuery">
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
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  searchQuery: string,
  yearOfRelease: string | null,
  currentPage: number,
  totalPages: number,
}>();
const emit = defineEmits<{
  (e: 'newSearchQuery', searchQuery: string): void;
  (e: 'newYearOfRelease', yearOfRelease: string | null): void;
  (e: 'newPage', page: number): void;
  (e: 'reset'): void;
}>();
const minYearOfRelease = 1800;

function generateAvailableYears() {
  return Array(new Date().getFullYear() + 1 - minYearOfRelease).fill(minYearOfRelease).map((x, y) => x + y).reverse();
}
</script>
