<template>
  <section class="form-section">
    <div
      v-if="title"
      class="form-section__header"
    >
      {{ title }}
    </div>
    <div class="form-section__content">
      <slot />
    </div>
    <div
      v-if="description"
      class="form-section__description"
    >
      {{ description }}
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  /**
   * Section title (will be converted to uppercase)
   */
  title?: string;

  /**
   * Optional description text below the content
   */
  description?: string;
}

defineProps<Props>();
</script>

<style>
  .form-section {
    margin: 20px 0;

    &__header {
      margin-bottom: 12px;
      color: var(--color-text-second);
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    &__content {
      margin-top: 12px;
    }

    &__description {
      margin-top: 8px;
      color: var(--color-text-second);
      font-size: 13px;
      line-height: 18px;
    }
  }
</style>
