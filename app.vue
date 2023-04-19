<template class="h-full">
    <div class="bg-zinc-900 min-h-screen">
        <NuxtPage/>
    </div>
</template>
<script lang="ts" setup>
useHead({
  bodyAttrs: {
    class: ['bg-zinc-900'],
  },
});
</script>
