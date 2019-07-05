<template>
  <transition>
    <div class="popup-window">
      <div class="popup-window__container">
        <slot class="popup-window__content"></slot>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'Popup'
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

  &__container {
    display: flex;
  }

  &__content {
    margin: auto;
  }
}
</style>
