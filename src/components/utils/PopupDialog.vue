<template>
  <transition
    name="popup-dialog-animation"
    appear
  >
    <div
      class="popup-dialog__mask"
      @click.self="$emit('close')"
    >
      <div
        class="popup-dialog__wrapper"
        :class="{'popup-dialog__wrapper--big': big}"
      >
        <slot />
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
    CloseButton,
  },
  props: {
    big: Boolean,
  },
  emits: ['close'],
};
</script>

<style>
  @import '../../styles/custom-properties.css';

  .popup-dialog {
    &-animation {
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
    }

    &__mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 9995;
      display: flex;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 50px;
      overflow-y: auto;
      background-color: rgba(0, 0, 0, .6);
      @mixin hide-scrollbar;
    }

    &__wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      max-width: 1000px;
      margin: auto 0;
      background-color: var(--color-bg-second);
      border-radius: 3px;
      box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.15);

      &--big {
        flex-grow: 1;
        margin: 0 0 auto;
      }
    }

    &__close-button {
      position: absolute;
      top: -5px;
      right: -68px;
      cursor: pointer;
    }
  }
</style>
