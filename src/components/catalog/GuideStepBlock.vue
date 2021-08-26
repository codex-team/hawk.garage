<template>
  <div class="instruction-block">
    <div class="instruction-block__step-container">
      <div class="instruction-block__step">
        {{ stepNumber }}
      </div>
      <div
        v-if="!last"
        class="instruction-block__step-line"
      />
    </div>
    <div class="instruction-block__content-container">
      <div class="instruction-block__header">
        <slot name="header" />
      </div>
      <div class="instruction-block__content">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuideStepBlock',
  props: {
    stepNumber: {
      type: Number,
      required: true,
    },
    last: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
.instruction-block {
  display: flex;

  &__step-container {
    display: flex;
    flex-direction: column;
  }

  &__step {
    position: relative;
    width: 28px;
    height: 28px;
    font-weight: bold;
    font-size: 12px;
    line-height: 25px;
    text-align: center;
    border: 2px solid var(--color-text-main);
    border-radius: 50%;
  }

  &__step-line {
    flex-grow: 3;
    width: 1px;

    margin: 7px auto;
    border: 1px solid var(--color-text-second);
    opacity: 0.14;
  }

  &__header {
    height: 28px;
    margin-left: 10px;
    font-weight: bold;
    font-size: 13px;
    line-height: 28px;
    letter-spacing: 0.16px;
    text-transform: uppercase;
  }

  &__content {
    margin-top: 15px;
    margin-left: 10px;
    font-size: 15px;
  }

  &__content-container {
    width: 100%;
    margin-bottom: 80px;
    overflow: hidden;
  }
}
</style>
