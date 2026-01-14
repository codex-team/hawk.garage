<template>
  <div
    class="event-details__content-block breadcrumb-item"
    data-ripple
  >
    <div
      class="breadcrumb-item__header-row"
      :class="{ 'breadcrumb-item__header-row--clickable': hasData }"
      @click="toggleExpanded"
    >
      <div class="breadcrumb-item__method">
        <BreadcrumbIcon
          :type="breadcrumb.type"
          :level="breadcrumb.level"
          class="breadcrumb-item__icon"
        />
        <span
          class="breadcrumb-item__type"
          :class="`breadcrumb-item__type--${breadcrumb.level || 'info'}`"
        >
          {{ formatType(breadcrumb.type) }}
        </span>
        <span v-if="breadcrumb.message" class="breadcrumb-item__separator">-</span>
        <span v-if="breadcrumb.message" class="breadcrumb-item__message-inline">
          {{ breadcrumb.message }}
        </span>
      </div>
      <div class="breadcrumb-item__meta">
        <span
          v-if="breadcrumb.category"
          class="breadcrumb-item__meta-category"
        >
          {{ breadcrumb.category }}
        </span>
        <span v-if="breadcrumb.category" class="breadcrumb-item__meta-separator">/</span>
        <span class="breadcrumb-item__meta-time">
          {{ formatTime(breadcrumb.timestamp) }}
        </span>
      </div>
      <Icon
        v-if="hasData"
        :class="{ 'breadcrumb-item__arrow-down--opened': isExpanded }"
        symbol="arrow-down"
        class="breadcrumb-item__arrow-down"
      />
    </div>
    <div
      v-show="isExpanded && hasData"
      class="breadcrumb-item__data-wrapper"
    >
      <div class="breadcrumb-item__data-content">
        <Json :value="breadcrumb.data || {}" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Breadcrumb } from '@hawk.so/types';
import BreadcrumbIcon from './BreadcrumbIcon.vue';
import Json from '../../../utils/Json.vue';
import Icon from '../../../utils/Icon.vue';

interface Props {
  breadcrumb: Breadcrumb;
}

const props = defineProps<Props>();

const isExpanded = ref(false);

const hasData = computed(() => {
  return props.breadcrumb.data && Object.keys(props.breadcrumb.data).length > 0;
});

const toggleExpanded = () => {
  if (hasData.value) {
    isExpanded.value = !isExpanded.value;
  }
};

const formatType = (type?: string): string => {
  if (!type) {
    return 'Event';
  }

  const typeMap: Record<string, string> = {
    default: 'Event',
    request: 'Request',
    ui: 'UI Click',
    navigation: 'Navigation',
    logic: 'Logic',
    error: 'Exception',
  };

  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date
    .getHours()
    .toString()
    .padStart(2, '0');
  const minutes = date
    .getMinutes()
    .toString()
    .padStart(2, '0');
  const seconds = date
    .getSeconds()
    .toString()
    .padStart(2, '0');
  const milliseconds = date
    .getMilliseconds()
    .toString()
    .padStart(3, '0');

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};
</script>

<style>
.event-details__content-block.breadcrumb-item {
  max-width: 100% !important;
  overflow: hidden !important;
}

.breadcrumb-item {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  &__arrow-down {
    position: absolute;
    top: 50%;
    right: 5px;
    width: 12px;
    height: 12px;
    margin: -6px 4px 0 11px;

    &--opened {
      transform: rotate(180deg);
    }
  }

  &__header-row {
    position: relative;
    display: flex;
    flex-direction: column;
    font-size: 13px;
    line-height: 1.4em;
    letter-spacing: 0.15px;
    user-select: none;
    min-width: 0;
    width: 100%;
    box-sizing: border-box;

    &--clickable {
      cursor: pointer;
    }
  }

  &__method {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 1px;
    margin-left: 28px;
    padding-right: 30px;
    min-width: 0;
    max-width: calc(100% - 28px);
    box-sizing: border-box;
  }

  &__icon {
    flex-shrink: 0;
    margin-left: -28px;
  }

  &__type {
    font-weight: 600;

    &--fatal,
    &--error {
      color: var(--color-indicator-critical);
    }

    &--warning {
      color: var(--color-indicator-warning);
    }

    &--info {
      color: var(--color-indicator-medium);
    }

    &--debug {
      color: var(--color-indicator-low);
    }
  }

  &__separator {
    color: var(--color-text-second);
    margin: 0 4px;
  }

  &__message-inline {
    color: var(--color-text-main);
    word-break: break-word;
    flex: 1;
    min-width: 0;
  }

  &__meta {
    display: flex;
    color: var(--color-text-second);
    font-size: 12px;
    margin-left: 28px;
    padding-right: 30px;
    min-width: 0;
    max-width: calc(100% - 28px);
    box-sizing: border-box;

    &-category {
      max-width: 600px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family: var(--font-monospace);
    }

    &-separator {
      margin: 0 4px;
      font-family: var(--font-monospace);
    }

    &-time {
      font-family: var(--font-monospace);
    }
  }

  &__data-wrapper {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    overflow: hidden;
  }

  &__data-content {
    margin-top: 8px;
    margin-left: 28px;
    padding-right: 30px;
    width: calc(100% - 28px);
    max-width: calc(100% - 28px);
    box-sizing: border-box;
    overflow-x: auto;
    overflow-y: visible;
    word-break: break-word;
    word-wrap: break-word;
    overflow-wrap: break-word;

    * {
      max-width: 100%;
      box-sizing: border-box;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    table, pre, code {
      max-width: 100%;
      overflow-x: auto;
      display: block;
    }
  }
}
</style>
