<template>
  <div
    class="breadcrumb-icon"
    :class="iconClass"
  >
    <svg
      v-if="type === 'error'"
      viewBox="0 0 24 24"
      class="breadcrumb-icon__svg"
    >
      <path
        fill="currentColor"
        d="M12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m-1-4h2V7h-2zm1 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
      />
    </svg>
    <svg
      v-else-if="type === 'navigation'"
      viewBox="0 0 24 24"
      class="breadcrumb-icon__svg"
    >
      <g
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          d="M6.142 6.142C8.904 3.381 10.284 2 12 2s3.096 1.38 5.858 4.142S22 10.284 22 12s-1.38 3.096-4.142 5.858S13.716 22 12 22s-3.096-1.38-5.858-4.142S2 13.716 2 12s1.38-3.096 4.142-5.858Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16 11.5L13.333 9M16 11.5L13.333 14M16 11.5h-5.333C9.777 11.5 8 12 8 14"
        />
      </g>
    </svg>
    <svg
      v-else-if="type === 'ui'"
      viewBox="0 0 24 24"
      class="breadcrumb-icon__svg"
    >
      <g fill="none">
        <path
          d="M12.756 11.519V7.565a1.756 1.756 0 0 0-3.512 0v8.785l-3.362-.748a.88.88 0 0 0-.922.37l-.544.817l3.862 5.024c.332.432.847.686 1.393.686h7.085c.756 0 1.428-.484 1.667-1.202l1.782-5.35a1.76 1.76 0 0 0-.78-2.073l-3.626-2.115a1.76 1.76 0 0 0-.885-.24z"
        />
        <path
          stroke="currentColor"
          stroke-linecap="square"
          stroke-width="2"
          d="M9.244 16.351V7.566a1.756 1.756 0 0 1 3.512 0v3.954h2.158a1.76 1.76 0 0 1 .885.24l3.625 2.115a1.76 1.76 0 0 1 .781 2.073l-1.782 5.35a1.76 1.76 0 0 1-1.667 1.202H9.671c-.546 0-1.06-.254-1.393-.686L4.416 16.79l.544-.816a.88.88 0 0 1 .922-.37zM6 5.499l-1-1m11 1l1-1m-6-1.585V1.5"
        />
      </g>
    </svg>
    <svg
      v-else-if="type === 'request'"
      viewBox="0 0 32 32"
      class="breadcrumb-icon__svg"
    >
      <path
        fill="currentColor"
        d="m16 13l-5 5l1.41 1.41L15 16.83V28H6v2h9a2 2 0 0 0 2-2V16.83l2.59 2.58L21 18Z"
      />
      <path
        fill="currentColor"
        d="M23.5 22H23v-2h.5a4.498 4.498 0 0 0 .356-8.981l-.815-.064l-.099-.812a6.994 6.994 0 0 0-13.883 0l-.1.812l-.815.064A4.498 4.498 0 0 0 8.5 20H9v2h-.5A6.497 6.497 0 0 1 7.2 9.136a8.994 8.994 0 0 1 17.6 0A6.497 6.497 0 0 1 23.5 22"
      />
    </svg>
    <svg
      v-else-if="type === 'logic'"
      viewBox="0 0 24 24"
      class="breadcrumb-icon__svg"
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M22 12h-5M2 9h5m-5 6h5M9 5c6 0 8 3.5 8 7s-2 7-8 7H7V5z"
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

/**
 * Props for BreadcrumbIcon component
 */
interface Props {
  /**
   * Breadcrumb type to determine icon
   */
  type?: BreadcrumbType;
  /**
   * Breadcrumb level (currently not used)
   */
  level?: BreadcrumbLevel;
}

const props = defineProps<Props>();

const iconClass = computed(() => {
  return `breadcrumb-icon--type-${props.type || 'default'}`;
});
</script>

<style scoped>
.breadcrumb-icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex-shrink: 0;

  &--type-error {
    background-color: rgba(217, 72, 72, 0.1);
    color: var(--color-indicator-critical);
  }

  &--type-navigation {
    background-color: rgba(0, 224, 100, 0.1);
    color: var(--color-indicator-positive);
  }

  &--type-ui {
    background-color: rgba(168, 85, 247, 0.1);
    color: #a855f7;
  }

  &--type-request {
    background-color: rgba(230, 167, 0, 0.1);
    color: var(--color-indicator-warning);
  }

  &--type-logic {
    background-color: rgba(113, 157, 255, 0.1);
    color: var(--color-text-highlighted);
  }

  &--type-default {
    background-color: rgba(148, 163, 184, 0.1);
    color: #94a3b8;
  }

  &__svg {
    width: 16px;
    height: 16px;
  }
}
</style>
