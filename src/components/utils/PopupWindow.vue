<template>
  <transition name="popup-window" appear>
    <div class="popup-window">
      <div class="popup-window__container">
        <div class="popup-window__content">
          <slot></slot>
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
    CloseButton
  }
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

    &-enter-active, &-leave-active {
      transition: all 150ms ease-in;
    }

    &-enter, &-leave-to {
      transform: scale(1.05);
      opacity: 0;
    }

    &-enter-to, &-leave {
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
