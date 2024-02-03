<template class="h-full">
    <div class="bg-zinc-900 min-h-screen">
        <NuxtPage/>
        <Footer/>
    </div>
</template>

<script lang="ts" setup>
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  bodyAttrs: {
    class: ['bg-zinc-900'],
  },
});
</script>
