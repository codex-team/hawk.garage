<template>
  <transition name="popup" appear>
    <div class="popup">
      <div class="popup__container">
        <div class="popup__content">
          <slot></slot>
        </div>
      </div>
      <div
        class="popup__exit-button exit-button"
        @click="$router.push('/')"
      >
        <Icon class="exit-button__icon" symbol="close"></Icon>
        <div class="exit-button__key">ESC</div>
      </div>
    </div>
  </transition>
</template>

<script>
import Icon from './Icon';

export default {
  name: 'Popup',
  components: {
    Icon
  }
};
</script>

<style>
  .popup {
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
      transition: all 300ms ease-in;
    }

    &-enter, &-leave-to {
      transform: scale(1.1);
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

    &__exit-button {
      position: fixed;
      top: 38px;
      right: 137px;

      cursor: pointer;
    }

  }

  .exit-button {
    text-align: center;

    &__icon {
      display: flex;
      box-sizing: border-box;
      width: 28px;
      height: 28px;
      padding: 6px;

      background-image: url("../assets/sprite.svg#close");
      background-position: center center;
      background-size: cover;
      border: 2px solid;
      border-radius: 50%;
    }

    &__key {
      margin-top: 10px;

      font-weight: bold;
      font-size: 12px;
      letter-spacing: 0.7px;
    }
  }
</style>
