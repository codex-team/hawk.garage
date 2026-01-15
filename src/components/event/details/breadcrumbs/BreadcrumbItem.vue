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
          :class="`breadcrumb-item__type--${breadcrumb.type || 'default'}`"
        >
          {{ t(`event.breadcrumbs.types.${formatType(breadcrumb.type)}`) }}
        </span>
        <span v-if="breadcrumb.message">-</span>
        <span
          v-if="breadcrumb.message"
          class="breadcrumb-item__message-inline"
          :title="breadcrumb.message"
        >
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
        <span
          v-if="breadcrumb.category"
          class="breadcrumb-item__meta-separator"
        >/</span>
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
      <div class="breadcrumb-item__data-header">
        <Icon
          symbol="copy"
          class="breadcrumb-item__copy-button"
          :class="{ 'breadcrumb-item__copy-button--copied': isCopied }"
          @click="copyBreadcrumb"
        />
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

const isExpanded = ref(false);
const isCopied = ref(false);

const hasData = computed(() => {
  return props.breadcrumb.data && Object.keys(props.breadcrumb.data).length > 0;
});

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

const toggleExpanded = () => {
  if (hasData.value) {
    isExpanded.value = !isExpanded.value;
  }
};

const copyBreadcrumb = async () => {
  try {
    const breadcrumbJson = JSON.stringify(props.breadcrumb, null, 2);

    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      await navigator.clipboard.writeText(breadcrumbJson);
    } else {
      /**
       * Fallback for older browsers
       */
      const textArea = document.createElement('textarea');

      textArea.value = breadcrumbJson;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
      } catch (err) {}

      document.body.removeChild(textArea);
    }

    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (error) {}
};

const formatType = (type?: string): string => {
  if (!type) {
    return 'default';
  }

  return type;
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
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 1px;
    margin-left: 28px;
    padding-right: 30px;
    min-width: 0;
    max-width: calc(100% - 28px);
    box-sizing: border-box;
  }

  &__icon {
    position: absolute;
    left: -28px;
    top: 0;
  }

  &__type {
    font-weight: 600;

    &--error {
      color: var(--color-indicator-critical);
    }

    &--navigation {
      color: var(--color-indicator-positive);
    }

    &--ui {
      color: #a855f7;
    }

    &--request {
      color: var(--color-indicator-warning);
    }

    &--logic {
      color: var(--color-text-highlighted);
    }

    &--default {
      color: #94a3b8;
    }
  }

  &__message-inline {
    color: var(--color-text-main);
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__meta {
    display: flex;
    color: var(--color-text-second);
    font-size: 12px;
    line-height: 1.5em;
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
    }

    &-separator {
      margin: 0 4px;
    }
  }

  &__data-wrapper {
    width: calc(100% - 28px);
    min-width: 0;
    max-width: calc(100% - 28px);
    box-sizing: border-box;
    overflow: hidden;
    margin-top: 8px;
    margin-left: 28px;
    background: var(--color-bg-code-fragment);
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  &__data-header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 6px;
    padding-right: 6px;
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
