<template>
    <Teleport to="body">
        <Transition name="slide-fade">
            <div v-if="message" class="fixed bottom-0 left-0 right-0 z-50">
                <div class="bg-red-600 text-center p-4 lg:px-4 w-full" role="alert">
                    <span class="font-semibold text-left flex-auto text-white">{{ message }}</span>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts" setup>
const message = ref<string>('');
const messageDurationInMilliseconds: number = 4000;
let messageTimeout: number | undefined;
defineExpose({show});

function show(newMessage: string) {
  message.value = newMessage;
  if (messageTimeout) {
    clearTimeout(messageTimeout);
  }
  messageTimeout = setTimeout(hide, messageDurationInMilliseconds);
}

function hide() {
  message.value = '';
}
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-in-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>