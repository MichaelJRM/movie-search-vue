<template>
    <Teleport to="body">
        <Transition name="slide-fade">
            <div v-if="isOpen"
                 class="modal fixed left-0 top-0 right-0 bottom-0 z-40 backdrop-blur-lg grid place-items-center"
                 @click="$emit('closeRequested')"
                 @mouseover.stop
            >
                <slot @click.stop></slot>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts" setup>
const props = defineProps<{
  isOpen: boolean;
}>();
const emit = defineEmits<{
  (e: 'closeRequested'): void;
}>();
const {isDesktop} = useDevice();


watchEffect(() => {
  if (props.isOpen) {
    // Prevent scrolling when the modal is open.
    // We add the padding on the right to prevent the body from shifting when the scrollbar disappears.
    document.body.classList.add('h-full', 'overflow-hidden');
    if (isDesktop) {
      document.body.classList.add('pr-4');
    }
  } else {
    document.body.classList.remove('h-full', 'overflow-hidden');
    if (isDesktop) {
      document.body.classList.remove('pr-4');
    }
  }
});
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
  transform: translateY(-20px);
  opacity: 0;
}
</style>
