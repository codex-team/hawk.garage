<template>
  <div
    class="form-control"
    :class="{
      'form-control--first': isFirst,
      'form-control--last': isLast,
      'form-control--only': isOnly,
    }"
  >
    <label
      v-if="label"
      class="form-control__label"
      :for="labelFor"
    >
      {{ label }}
    </label>
    <div class="form-control__control">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  /**
   * Label text for the control
   */
  label?: string;

  /**
   * ID to associate label with input (for accessibility)
   */
  labelFor?: string;

  /**
   * Whether this is the first control in a group
   */
  isFirst?: boolean;

  /**
   * Whether this is the last control in a group
   */
  isLast?: boolean;

  /**
   * Whether this is the only control in a group
   */
  isOnly?: boolean;
}

defineProps<Props>();
</script>

<style>
  .form-control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background-color: var(--color-bg-main);
    border-radius: 0;

    --radius: 10px;

    &__label {
      flex: 1;
      color: var(--color-text-main);
      font-size: 15px;
      line-height: 20px;
      cursor: pointer;
    }

    &__control {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
    }

    &--first {
      border-top-left-radius: var(--radius);
      border-top-right-radius: var(--radius);
    }

    &--last {
      border-bottom-left-radius: var(--radius);
      border-bottom-right-radius: var(--radius);
    }

    &--only {
      border-radius: var(--radius);
    }

    &:not(.form-control--last) {
      margin-bottom: 1px;
    }

    &:not(.form-control--first):not(.form-control--last) {
      margin-top: -1px;
    }
  }
</style>
