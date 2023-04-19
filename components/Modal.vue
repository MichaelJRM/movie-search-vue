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

// Prevent scrolling when the modal is open.
const openExtraCssClasses = ['h-full', 'overflow-hidden'];
// We add the padding on the right to prevent the body from shifting when the scrollbar disappears.
const openDesktopOnlyExtraCssClasses = ['pr-4'];
watchEffect(() => {
  if (props.isOpen) {
    document.body.classList.add(...openExtraCssClasses);
    if (isDesktop) {
      document.body.classList.add(...openDesktopOnlyExtraCssClasses);
    }
  } else {
    document.body.classList.remove(...openExtraCssClasses);
    if (isDesktop) {
      document.body.classList.remove(...openDesktopOnlyExtraCssClasses);
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
