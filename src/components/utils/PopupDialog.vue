<template>
  <transition
    :name="noMaskAnimation? null: 'popup-dialog-animation'"
    appear
  >
    <div
      class="popup-dialog__mask"
      @click.self="$emit('close')"
    >
<!--      <transition-->
<!--        name="popup-dialog-container-animation"-->
<!--        appear-->
<!--      >-->
        <div class="popup-dialog__container">
          <slot />
          <CloseButton
            class="popup-dialog__close-button"
            @close="$emit('close')"
          />
        </div>
<!--      </transition>-->
    </div>
  </transition>
</template>

<script>
import CloseButton from './CloseButton';

export default {
  name: 'PopupDialog',
  components: {
    CloseButton
  },
  props: {
    noMaskAnimation: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style>
  @import '../../styles/custom-properties.css';

  .popup-dialog {
    &-animation-enter-active,
    &-animation-leave-active {
      transition: all 150ms ease-in;
    }

    &-animation-enter,
    &-animation-leave-to {
      transform: scale(1.05);
      opacity: 0;
    }

    &-animation-leave-to {
      transform: none;
      opacity: 1;
    }

    &-animation-enter-to,
    &-animation-leave {
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
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 50px;
      overflow-y: auto;
      background-color: rgba(0, 0, 0, .6);
      @apply --hide-scrollbar;
    }

    &__container {
      position: relative;
      max-width: 90%;
      margin: auto 0;
      border-radius: 3px;
      box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.15);
    }

    &__close-button {
      position: absolute;
      top: -5px;
      right: -68px;
      cursor: pointer;
    }
  }
</style>
