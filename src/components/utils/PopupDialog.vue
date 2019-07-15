<template>
  <transition
    name="popup-dialog"
    appear
  >
    <div
      class="popup-dialog__mask"
      @click.self="$emit('close')"
    >
      <div class="popup-dialog__wrapper">
        <div class="popup-dialog__container">
          <slot />
        </div>
        <CloseButton
          class="popup-dialog__close-button"
          @close="$emit('close')"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import CloseButton from './CloseButton';

export default {
  name: 'PopupDialog',
  components: {
    CloseButton
  }
};
</script>

<style>
  .popup-dialog {
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

    &__mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 50px;
      background-color: rgba(0, 0, 0, .6);
    }

    &__wrapper {
      position: relative;
      display: flex;
      max-width: 90%;
      background-color: var(--color-bg-second);
      border-radius: 3px;
      box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.15);
    }

    &__container {
      width: 100%;
      margin: auto;
    }

    &__close-button {
      position: absolute;
      top: -5px;
      right: -68px;
      cursor: pointer;
    }
  }
</style>
