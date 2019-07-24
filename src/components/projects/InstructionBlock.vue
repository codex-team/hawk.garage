<template>
  <div class="instruction-block">
    <div class="instruction-block__step-container">
      <div class="instruction-block__step">
        {{ stepNumber }}
      </div>
      <div class="instruction-block__step-line" />
    </div>
    <div class="instruction-block__content">
      <div class="instruction-block__header">
        <slot name="header" />
      </div>
      <slot name="content" />
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
    }
  }
};
</script>

<style>
.instruction-block {
  display: flex;

  &__step {
    position: relative;
    width: 35px;
    height: 35px;
    font-weight: bold;
    line-height: 32px;
    text-align: center;
    border: 2px solid var(--color-text-second);
    border-radius: 50%;
  }

  &__header {
    font-weight: bold;
    font-size: 12px;
    letter-spacing: 0.15px;
  }
}
</style>
