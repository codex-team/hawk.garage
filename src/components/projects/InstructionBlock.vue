<template>
  <div class="instruction-block">
    <div class="instruction-block__step-container">
      <div class="instruction-block__step">
        {{ stepNumber }}
      </div>
      <div v-if="!last" class="instruction-block__step-line" />
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
  name: 'InstructionBlock',
  props: {
    stepNumber: {
      type: Number,
      required: true
    },
    last: {
      type: Boolean,
      default: false
    }
  }
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
    font-size: 12px;
    height: 28px;
    font-weight: bold;
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
  }

  &__header {
    height: 28px;
    margin-left: 10px;
    font-weight: bold;
    font-size: 12px;
    line-height: 28px;
    letter-spacing: 0.15px;
  }

  &__content {
    font-size: 14px;
    margin-left: 10px;
  }
}
</style>
