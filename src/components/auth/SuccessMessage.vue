<template>
  <div class="success-message__wrap">
    <div class="success-message">
      <span class="success-message__icon">
        💌
      </span>
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

/**
 * Component implements message of success password recover
 */
export default defineComponent({
  props: {
    /**
     * Message to show
     */
    message: {
      type: String,
      required: true,
    },
  },
});
</script>

<style>
.success-message {
  display: inline-block;
  padding: 13px 15px;
  font-size: 14px;
  border: solid 1px var(--color-border);
  border-radius: 3px;

  &__wrap {
    margin-bottom: 30px;
    text-align: center;
  }

  &__icon {
    margin-right: 10px;
    font-size: 13px;
  }
}
</style>
