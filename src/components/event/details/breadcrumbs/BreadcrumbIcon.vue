<template>
  <div
    class="breadcrumb-icon"
    :class="iconClass"
  >
    <svg
      v-if="type === 'error'"
      viewBox="0 0 16 16"
      class="breadcrumb-icon__svg"
    >
      <path
        fill="currentColor"
        d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10.5a1 1 0 110-2 1 1 0 010 2zm.88-3.83v.58a.88.88 0 11-1.76 0v-.88a.88.88 0 01.88-.88c.48 0 .88.4.88.88v.3z"
      />
    </svg>
    <svg
      v-else-if="type === 'navigation'"
      viewBox="0 0 16 16"
      class="breadcrumb-icon__svg"
    >
      <path
        fill="currentColor"
        d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 10a1 1 0 110-2 1 1 0 010 2zm0-9a3 3 0 00-3 3v1a1 1 0 102 0V6a1 1 0 112 0v1a1 1 0 102 0V6a3 3 0 00-3-3z"
      />
    </svg>
    <svg
      v-else-if="type === 'ui'"
      viewBox="0 0 16 16"
      class="breadcrumb-icon__svg"
    >
      <path
        fill="currentColor"
        d="M1 3l2.5-2.5L5 2l8 8-1.5 1.5L3 3zm13.5 8.5L13 13l-8-8 1.5-1.5L15 12l-.5 2.5z"
      />
    </svg>
    <svg
      v-else-if="type === 'request'"
      viewBox="0 0 16 16"
      class="breadcrumb-icon__svg"
    >
      <path
        fill="currentColor"
        d="M8 1a7 7 0 100 14A7 7 0 008 1zm3 8H5V7h6v2z"
      />
    </svg>
    <svg
      v-else-if="type === 'logic'"
      viewBox="0 0 16 16"
      class="breadcrumb-icon__svg"
    >
      <path
        fill="currentColor"
        d="M8 2a6 6 0 100 12A6 6 0 008 2zM5.5 6a1 1 0 112 0 1 1 0 01-2 0zm5 0a1 1 0 11-2 0 1 1 0 012 0zM8 11a3 3 0 01-2.8-2h1.6a1.4 1.4 0 002.4 0h1.6A3 3 0 018 11z"
      />
    </svg>
    <svg
      v-else
      viewBox="0 0 16 16"
      class="breadcrumb-icon__svg"
    >
      <circle
        cx="8"
        cy="8"
        r="3"
        fill="currentColor"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BreadcrumbType, BreadcrumbLevel } from '@hawk.so/types';

interface Props {
  type?: BreadcrumbType;
  level?: BreadcrumbLevel;
}

const props = defineProps<Props>();

const iconClass = computed(() => {
  const classes: string[] = [];

  // Приоритет отдаем level для цвета
  if (props.level) {
    classes.push(`breadcrumb-icon--level-${props.level}`);
  } else {
    // Fallback на type для цвета
    classes.push(`breadcrumb-icon--type-${props.type || 'default'}`);
  }

  return classes.join(' ');
});
</script>

<style scoped>
.breadcrumb-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;

  /* Цвета по level (приоритет) */
  &--level-fatal,
  &--level-error {
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  &--level-warning {
    background-color: rgba(251, 146, 60, 0.1);
    color: #fb923c;
  }

  &--level-info {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }

  &--level-debug {
    background-color: rgba(148, 163, 184, 0.1);
    color: #94a3b8;
  }

  /* Цвета по type (fallback) */
  &--type-error {
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  &--type-navigation {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }

  &--type-ui {
    background-color: rgba(168, 85, 247, 0.1);
    color: #a855f7;
  }

  &--type-request {
    background-color: rgba(34, 197, 94, 0.1);
    color: #22c55e;
  }

  &--type-logic {
    background-color: rgba(99, 102, 241, 0.1);
    color: #6366f1;
  }

  &--type-default {
    background-color: rgba(148, 163, 184, 0.1);
    color: #94a3b8;
  }

  &__svg {
    width: 12px;
    height: 12px;
  }
}
</style>
