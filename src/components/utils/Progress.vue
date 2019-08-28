<template>
  <div
    ref="container"
    class="progress"
  >
    <div class="progress__bar" :style="progressStyles"/>
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

    &__bar {
      height: 100%;
      transition: width .1s linear;
    }
  }
</style>
