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
      <div class="breadcrumb-item__type-column">
        <BreadcrumbIcon
          :type="breadcrumb.type"
          :level="breadcrumb.level"
          :status-code="getStatusCode"
          class="breadcrumb-item__icon"
        />
        <span
          class="breadcrumb-item__type"
          :class="[
            `breadcrumb-item__type--${breadcrumb.type || 'default'}`,
            getStatusCode && breadcrumb.type === 'request' && getStatusCode === 200 ? 'breadcrumb-item__type--status-success' : '',
            getStatusCode && breadcrumb.type === 'request' && getStatusCode >= 500 ? 'breadcrumb-item__type--status-error' : ''
          ]"
        >
          {{ t(`event.breadcrumbs.types.${formatType(breadcrumb.type)}`) }}
        </span>
      </div>
      <div class="breadcrumb-item__content-column">
        <div
          v-if="breadcrumb.message"
          class="breadcrumb-item__message"
          :title="breadcrumb.message"
        >
          {{ breadcrumb.message }}
        </div>
        <div class="breadcrumb-item__meta">
          <span
            v-if="breadcrumb.category"
            class="breadcrumb-item__meta-category"
          >
            {{ breadcrumb.category }}
          </span>
          <span
            v-if="breadcrumb.category"
            class="breadcrumb-item__meta-separator"
          />
          <span class="breadcrumb-item__meta-time">
            {{ formatTime(breadcrumb.timestamp) }}
          </span>
        </div>
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
      <div class="breadcrumb-item__data-header">
        <div
          v-copyable="{
            selector: '.breadcrumb-item__json-content',
            callback: onBreadcrumbCopied,
          }"
        >
          <Icon
            symbol="copy"
            class="breadcrumb-item__copy-button"
            :class="{ 'breadcrumb-item__copy-button--copied': isCopied }"
          />
          <div class="breadcrumb-item__json-content">
            {{ breadcrumbJson }}
          </div>
        </div>
      </div>
      <div class="breadcrumb-item__data-content">
        <Json :value="expandedData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Breadcrumb } from '@hawk.so/types';
import BreadcrumbIcon from './BreadcrumbIcon.vue';
import Json from '../../../utils/Json.vue';
import Icon from '../../../utils/Icon.vue';
import notifier from 'codex-notifier';
import { prettyDateFromDateTimeString } from '@/utils/filters';

const { t } = useI18n();

/**
 * Props for BreadcrumbItem component
 */
interface Props {
  /**
   * Breadcrumb data to display
   */
  breadcrumb: Breadcrumb;
}

const props = defineProps<Props>();

/**
 * Whether the breadcrumb data section is expanded
 */
const isExpanded = ref(false);

/**
 * Whether the breadcrumb was successfully copied to clipboard
 */
const isCopied = ref(false);

/**
 * Checks if breadcrumb has data to display
 *
 * @returns {boolean} True if breadcrumb has data, false otherwise
 */
const hasData = computed(() => {
  return props.breadcrumb.data && Object.keys(props.breadcrumb.data).length > 0;
});

/**
 * Expanded breadcrumb data including message if present
 *
 * @returns {Record<string, unknown>} Breadcrumb data with optional message field
 */
const expandedData = computed(() => {
  const data = { ...props.breadcrumb.data };

  if (props.breadcrumb.message) {
    return {
      message: props.breadcrumb.message,
      ...data,
    };
  }

  return data;
});

/**
 * JSON string representation of breadcrumb for copying
 *
 * @returns {string} Formatted JSON string
 */
const breadcrumbJson = computed(() => {
  return JSON.stringify(props.breadcrumb, null, 2);
});

/**
 * Toggles the expanded state of breadcrumb data section
 */
const toggleExpanded = () => {
  if (hasData.value) {
    isExpanded.value = !isExpanded.value;
  }
};

/**
 * Callback for copyable directive when breadcrumb is copied
 *
 * @param {string} copiedText - Text that was copied to clipboard
 */
const onBreadcrumbCopied = (copiedText: string) => {
  if (copiedText) {
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);

    notifier.show({
      message: t('common.copiedNotification'),
      style: 'success',
      time: 2000,
    });
  }
};

/**
 * Formats breadcrumb type for display
 *
 * @param {string | undefined} type - Breadcrumb type
 * @returns {string} Formatted type or 'default' if type is not provided
 */
const formatType = (type?: string): string => {
  if (!type) {
    return 'default';
  }

  return type;
};

/**
 * Gets HTTP status code from breadcrumb data if it's a request type
 *
 * @returns {number | undefined} Status code or undefined
 */
const getStatusCode = computed(() => {
  if (props.breadcrumb.type === 'request' && props.breadcrumb.data) {
    const statusCode = props.breadcrumb.data.statusCode;

    return typeof statusCode === 'number' ? statusCode : undefined;
  }

  return undefined;
});

/**
 * Formats timestamp to date and time string with milliseconds
 * Uses prettyDateFromDateTimeString and adds seconds and milliseconds
 *
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date and time string (e.g., "15 Feb, 12:21:12.120")
 */
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const dateStr = date.toISOString();
  let baseFormat = prettyDateFromDateTimeString(dateStr, true);

  /**
   * prettyDateFromDateTimeString returns format like "15 Feb 12:21" or "2020, 15 Feb 12:21"
   * We need format "15 Feb, 12:21:12.120" - add comma after month if not present
   */
  if (!baseFormat.includes(',')) {
    /**
     * Add comma after month (e.g., "15 Feb" -> "15 Feb,")
     */
    baseFormat = baseFormat.replace(/(\w{3} \d{1,2}) /, '$1, ');
  }

  const seconds = date.getSeconds()
    .toString()
    .padStart(2, '0');
  const milliseconds = date.getMilliseconds()
    .toString()
    .padStart(3, '0');

  /**
   * Replace the time part (HH:MM) with full time (HH:MM:SS.mmm)
   */
  return baseFormat.replace(/(\d{2}:\d{2})$/, `$1:${seconds}.${milliseconds}`);
};
</script>

<style scoped>
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
    transform: translateY(-50%);

    &--opened {
      transform: translateY(-50%) rotate(180deg);
    }
  }

  &__header-row {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 12px;
    align-items: center;
    font-size: 13px;
    line-height: 1.4em;
    letter-spacing: 0.15px;
    user-select: none;
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
    padding-right: 30px;

    &--clickable {
      cursor: pointer;
    }
  }

  &__type-column {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    min-width: 100px;
    max-width: 120px;
    flex-shrink: 0;
  }

  &__icon {
    flex-shrink: 0;
  }

  &__type {
    font-weight: 600;
    white-space: nowrap;

    &--error {
      color: var(--color-indicator-critical);
    }

    &--navigation {
      color: #ff66cf;
    }

    &--ui {
      color: #a855f7;
    }

    &--request {
      color: var(--color-indicator-warning);
    }

    &--status-success {
      color: var(--color-indicator-positive);
    }

    &--status-error {
      color: var(--color-indicator-critical);
    }

    &--logic {
      color: var(--color-text-highlighted);
    }

    &--default {
      color: #94a3b8;
    }
  }

  &__content-column {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
  }

  &__message {
    color: var(--color-text-main);
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 1.4em;
  }

  &__meta {
    display: flex;
    color: var(--color-text-second);
    font-size: 12px;
    line-height: 1.4em;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;

    &-category {
      max-width: 600px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &-separator {
      margin: 0 4px;

      &::before {
        content: '/';
      }
    }
  }

  &__data-wrapper {
    grid-column: 1 / -1;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    margin-top: 8px;
    background: var(--color-bg-code-fragment);
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  &__data-header {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 6px;
    padding-right: 4px;
    min-width: 0;
    box-sizing: border-box;
  }

  &__copy-button {
    width: 14px;
    height: 14px;
    cursor: pointer;
    color: var(--color-text-second);
    transition: color 0.2s;
    flex-shrink: 0;

    &:hover {
      color: var(--color-text-main);
    }

    &--copied {
      color: var(--color-indicator-positive) !important;
    }
  }

  &__json-content {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &__data-content {
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

/* Local override for JSON viewer in breadcrumbs */
body .breadcrumb-item__data-content .json-viewer-theme {
  padding-top: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-bottom: 20px !important;
}

/* Remove hover for JSON viewer, as like in code-preview */
body .breadcrumb-item__data-content .vjs-tree-node.dark:hover {
  background-color: transparent !important;
}
</style>
