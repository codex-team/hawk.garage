<template>
  <div class="progress">
    <div
      class="progress__bar"
      :style="progressStyles"
    />
  </div>
</template>

<script>
export default {
  name: 'Progress',
  props: {
    current: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      default: '#fff'
    }
  },
  computed: {
    progressStyles() {
      const progressWidth = this.current / this.max * 100;

      return {
        'background-color': this.color,
        width: `${progressWidth}%`
      };
    }
  }
};
</script>

<style>
  .progress {
    overflow: hidden;
    border-radius: 2px;

    &__bar {
      height: 100%;
      border-radius: 2px;
      transition: width .1s linear;
    }
  }
</style>
