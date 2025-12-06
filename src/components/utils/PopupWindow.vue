<template>
  <transition
    name="popup-window"
    appear
  >
    <div class="popup-window">
      <div class="popup-window__container">
        <div class="popup-window__content">
          <slot />
        </div>
      </div>
      <CloseButton
        class="popup-window__close-button"
        @close="$emit('close')"
      />
    </div>
  </transition>
</template>

<script>
import CloseButton from './CloseButton';

export default {
  name: 'PopupWindow',
  components: {
    CloseButton,
  },
  emits: ['close'],
};
</script>

<style>
  .popup-window {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    display: flex;
    align-content: stretch;
    align-items: stretch;

    &-enter-active,
    &-leave-active,
    &-appear-active {
      transition: all 150ms ease-in;
    }

    &-enter-from,
    &-leave-to,
    &-appear-from {
      transform: scale(1.05);
      opacity: 0;
    }

    &-enter-to,
    &-leave-from,
    &-appear-to {
      transform: none;
      opacity: 1;
    }

    &__container {
      display: flex;
      width: 100%;
    }

    &__content {
      width: 100%;
      height: 100%;
    }

    &__close-button {
      position: fixed;
      top: 38px;
      right: 137px;
      cursor: pointer;
    }
  }
</style>
