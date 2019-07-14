<template>
  <div
    class="close-button"
    @click="$emit('close')"
  >
    <Icon
      class="close-button__icon"
      symbol="close"
    />
    <div class="close-button__key">
      ESC
    </div>
  </div>
</template>

<script>
import Icon from './Icon';

export default {
  name: 'CloseButton',
  components: {
    Icon
  },
  created() {
    window.addEventListener('keyup', this.onEscapeKeyUp);
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.onEscapeKeyUp);
  },
  methods: {
    onEscapeKeyUp(event) {
      const ESCAPE_KEY = 27;

      if (event.which === ESCAPE_KEY) {
        this.$emit('close');
      }
    }
  }
};
</script>

<style>
  .close-button {
    padding: 15px;
    text-align: center;
    user-select: none;

    &__icon {
      display: flex;
      width: 28px;
      height: 28px;
      padding: 6px;
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
