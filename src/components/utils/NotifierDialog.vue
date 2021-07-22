<template>
  <transition name="popup-dialog-animation" appear>
    <div class="popup-dialog__wrapper">
      <slot />
    </div>
  </transition>
</template>

<script>
import CloseButton from './CloseButton';

export default {
  name: 'NotifierDialog',
  components: {
    CloseButton,
  },
  props: {
    big: Boolean,
  },
};
</script>

<style>
@import "../../styles/custom-properties.css";
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }

  50% {
    opacity: 1;
    transform: scale(1.05);
  }

  70% {
    transform: scale(0.9);
  }

  100% {
    transform: scale(1);
  }
}
.popup-dialog {
  &-animation {
    &-enter-active {
      animation: bounceIn 600ms ease;
    }
  }

  &__wrapper {
    @apply --hide-scrollbar;
    position: fixed;
    right: 30px;
    bottom: 30px;
    z-index: 9995;
    border-radius: 12px;
    background-color: var(--color-bg-second);
    box-shadow: 0 6px 17px -4px rgb(0 0 0 / 61%);
  }
}
</style>
