<template>
  <transition name="popup-window" appear>
    <div class="popup-dialog__mask">
      <div class="popup-dialog__wrapper">
        <div class="popup-dialog__container">
          <slot></slot>
        </div>
      </div>
      <CloseButton/>
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
      left: 0;
      z-index: 9998;
      display: table;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s ease;
    }
  }
</style>
