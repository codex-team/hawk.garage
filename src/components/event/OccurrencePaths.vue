<template>
  <div class="occurrence-paths">
    <div class="occurrence-paths__header">
      <h2 class="occurrence-paths__title">
        {{ t('event.occurrencePaths.title') }}
      </h2>
      <p class="occurrence-paths__description">
        {{ t('event.occurrencePaths.description') }}
      </p>
      <div class="occurrence-paths__sort">
        <span class="occurrence-paths__sort-label">
          {{ t('event.occurrencePaths.sort.title') }}
        </span>
        <FilterButton
          v-for="option in sortOptions"
          :key="option.value"
          :active="sortKey === option.value"
          :content="sortButtonLabel(option.value, option.label)"
          @click="selectSort(option.value)"
        />
      </div>
    </div>

    <div class="occurrence-paths__list">
      <article
        v-for="(path, pathIndex) in sortedPaths"
        :key="displayedBreadcrumbs(path.breadcrumbs).map(breadcrumb => breadcrumb.message).join(':')"
        class="occurrence-path"
      >
        <div class="occurrence-path__heading">
          <span class="occurrence-path__rank">
            #{{ pathIndex + 1 }}
          </span>
          <span class="occurrence-path__share">
            {{ formatShare(path.share) }}
          </span>
        </div>

        <div class="occurrence-path__sequence">
          <template
            v-for="(breadcrumb, breadcrumbIndex) in displayedBreadcrumbs(path.breadcrumbs)"
            :key="`${breadcrumb.timestamp}:${breadcrumbIndex}`"
          >
            <div
              class="occurrence-path__step"
              :style="{ '--occurrence-path-step-color': `var(${getBreadcrumbColor(breadcrumb)})` }"
            >
              <BreadcrumbIcon
                :type="breadcrumb.type"
                :level="breadcrumb.level"
                :color-variable="getBreadcrumbColor(breadcrumb)"
              />
              <div class="occurrence-path__step-content">
                <span class="occurrence-path__step-type">
                  {{ breadcrumbTypeLabel(breadcrumb.type) }}
                </span>
                <span
                  class="occurrence-path__step-message"
                  :title="breadcrumb.message"
                >
                  {{ breadcrumb.message || breadcrumb.category }}
                </span>
              </div>
            </div>
            <span
              v-if="breadcrumbIndex < displayedBreadcrumbs(path.breadcrumbs).length - 1"
              class="occurrence-path__arrow"
            >
              →
            </span>
          </template>
        </div>

        <dl class="occurrence-path__metrics">
          <div class="occurrence-path__metric">
            <dt>{{ t('event.occurrencePaths.metrics.repetitions') }}</dt>
            <dd>{{ spacedNumber(path.repetitionsCount) }}</dd>
          </div>
          <div class="occurrence-path__metric">
            <dt>{{ t('event.occurrencePaths.metrics.users') }}</dt>
            <dd>{{ spacedNumber(path.usersAffected) }}</dd>
          </div>
          <div class="occurrence-path__metric">
            <dt>{{ t('event.occurrencePaths.metrics.share') }}</dt>
            <dd>{{ formatShare(path.share) }}</dd>
          </div>
          <div class="occurrence-path__metric">
            <dt>{{ t('event.occurrencePaths.metrics.firstSeen') }}</dt>
            <dd>{{ prettyFullDate(path.firstSeen) }}</dd>
          </div>
          <div class="occurrence-path__metric">
            <dt>{{ t('event.occurrencePaths.metrics.lastSeen') }}</dt>
            <dd>{{ prettyFullDate(path.lastSeen) }}</dd>
          </div>
          <div
            v-if="release"
            class="occurrence-path__metric occurrence-path__metric--release"
          >
            <dt>{{ t('event.occurrencePaths.metrics.release') }}</dt>
            <dd>
              <code>{{ release }}</code>
            </dd>
          </div>
        </dl>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Breadcrumb, BreadcrumbType } from '@hawk.so/types';
import type { HawkEvent } from '@/types/events';
import { getEventOccurrencePathsMock } from '@/api/events/mocks/occurrencePaths';
import { getBreadcrumbColor } from '@/components/utils/breadcrumbs/breadcrumbColor';
import { prettyFullDate, spacedNumber } from '@/utils/filters';
import BreadcrumbIcon from './details/breadcrumbs/BreadcrumbIcon.vue';
import FilterButton from '../utils/FilterButton.vue';

const props = defineProps<{
  event: HawkEvent;
  projectId: string;
}>();

const { locale, t } = useI18n();
const sortKey = ref('repetitionsCount');
const sortDirection = ref('desc');
const hasSelectedInitialSort = ref(false);
const DISPLAYED_BREADCRUMBS_LIMIT = 4;

const sortOptions = computed(() => [
  {
    value: 'repetitionsCount',
    label: t('event.occurrencePaths.sort.repetitions'),
  },
  {
    value: 'usersAffected',
    label: t('event.occurrencePaths.sort.users'),
  },
  {
    value: 'share',
    label: t('event.occurrencePaths.sort.share'),
  },
  {
    value: 'lastSeen',
    label: t('event.occurrencePaths.sort.lastSeen'),
  },
]);

const occurrencePathsResponse = computed(() => {
  return getEventOccurrencePathsMock(props.projectId, props.event);
});

const sortedPaths = computed(() => {
  const paths = occurrencePathsResponse.value.data.project.event.occurrencePaths.nodes;

  return [...paths].sort((firstPath, secondPath) => {
    let difference = 0;

    switch (sortKey.value) {
      case 'usersAffected':
        difference = firstPath.usersAffected - secondPath.usersAffected;
        break;
      case 'share':
        difference = firstPath.share - secondPath.share;
        break;
      case 'lastSeen':
        difference = firstPath.lastSeen - secondPath.lastSeen;
        break;
      case 'repetitionsCount':
      default:
        difference = firstPath.repetitionsCount - secondPath.repetitionsCount;
        break;
    }

    return sortDirection.value === 'desc' ? -difference : difference;
  });
});

const release = computed(() => {
  return props.event.release?.releaseName || props.event.payload.release;
});

/**
 * Select sort field or toggle direction for the current field.
 *
 * @param key - mock response field used for sorting
 */
function selectSort(key: string): void {
  if (sortKey.value === key) {
    if (!hasSelectedInitialSort.value) {
      sortDirection.value = 'desc';
      hasSelectedInitialSort.value = true;

      return;
    }

    sortDirection.value = sortDirection.value === 'desc' ? 'asc' : 'desc';

    return;
  }

  sortKey.value = key;
  sortDirection.value = 'desc';
  hasSelectedInitialSort.value = true;
}

/**
 * Return only the latest breadcrumbs preceding the final error step.
 *
 * @param breadcrumbs - full normalized occurrence path
 */
function displayedBreadcrumbs(breadcrumbs: Breadcrumb[]): Breadcrumb[] {
  return breadcrumbs
    .filter(breadcrumb => breadcrumb.type !== 'error')
    .slice(-DISPLAYED_BREADCRUMBS_LIMIT);
}

/**
 * Build a sort button label with direction indicator for the active field.
 *
 * @param value - sort field
 * @param label - translated field label
 */
function sortButtonLabel(value: string, label: string): string {
  if (sortKey.value !== value) {
    return label;
  }

  return `${label} ${sortDirection.value === 'desc' ? '↓' : '↑'}`;
}

/**
 * Format path share using the active interface locale.
 *
 * @param share - value from 0 to 1
 */
function formatShare(share: number): string {
  return new Intl.NumberFormat(locale.value, {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(share);
}

/**
 * Get a translated breadcrumb type label.
 *
 * @param type - existing Breadcrumb type
 */
function breadcrumbTypeLabel(type?: BreadcrumbType): string {
  const knownType = type || 'default';
  const translationKey = `event.breadcrumbs.types.${knownType}`;
  const translated = t(translationKey);

  return translated === translationKey ? knownType : translated;
}
</script>

<style scoped>
@import '../../styles/custom-properties.css';

.occurrence-paths {
  &__header {
    margin-bottom: 20px;
  }

  &__title {
    margin: 0 0 7px;
    color: var(--color-text-main);
    font-size: 18px;
    line-height: 24px;
  }

  &__description {
    max-width: 510px;
    margin: 0;
    color: var(--color-text-second);
    font-size: 13px;
    line-height: 20px;
  }

  &__sort {
    display: flex;
    flex-wrap: nowrap;
    gap: 3px;
    align-items: center;
    margin-top: 13px;
    padding-bottom: 2px;
    overflow-x: auto;
    white-space: nowrap;

    @mixin hide-scrollbar;
  }

  &__sort-label {
    flex: 0 0 auto;
    margin-right: 4px;

    @mixin ui-label;
  }

  &__list {
    display: grid;
    gap: 14px;
    min-width: 0;
  }
}

.occurrence-path {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  padding: 18px;
  overflow: hidden;
  background: var(--color-bg-second);
  border: 1px solid var(--color-delimiter-line);
  border-radius: var(--border-radius);

  &__heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 13px;
  }

  &__rank {
    color: var(--color-text-second);
    font-weight: 600;
    font-size: 12px;
  }

  &__share {
    padding: 4px 7px;
    color: var(--color-text-main);
    font-weight: 600;
    font-size: 12px;
    background: var(--color-bg-third);
    border-radius: 5px;
  }

  &__sequence {
    display: flex;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    align-items: stretch;
    padding-bottom: 8px;
    overflow-x: auto;

    @mixin hide-scrollbar;
  }

  &__step {
    display: flex;
    flex: 0 0 auto;
    gap: 9px;
    align-items: center;
    min-width: 132px;
    max-width: 190px;
    padding: 9px 10px;
    background: var(--color-bg-main);
    border: 1px solid var(--color-delimiter-line);
    border-top: 2px solid var(--occurrence-path-step-color);
    border-radius: 7px;

  }

  &__step-content {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 3px;
  }

  &__step-type {
    color: var(--occurrence-path-step-color);
    font-weight: 700;
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }

  &__step-message {
    overflow: hidden;
    color: var(--color-text-main);
    font-size: 12px;
    line-height: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__arrow {
    display: flex;
    flex: 0 0 24px;
    align-items: center;
    justify-content: center;
    color: var(--color-text-second);
    font-size: 14px;
  }

  &__metrics {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 14px;
    margin: 10px 0 0;
    padding-top: 14px;
    border-top: 1px solid var(--color-delimiter-line);
  }

  &__metric {
    min-width: 0;

    dt {
      margin-bottom: 5px;

      @mixin ui-label;
    }

    dd {
      margin: 0;
      overflow: hidden;
      color: var(--color-text-main);
      font-weight: 600;
      font-size: 13px;
      line-height: 18px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    code {
      display: inline-block;
      max-width: 100%;
      padding: 3px 5px;
      overflow: hidden;
      color: var(--color-text-second);
      font-size: 11px;
      font-family: var(--font-monospace);
      vertical-align: top;
      white-space: nowrap;
      text-overflow: ellipsis;
      background: var(--color-bg-main);
      border-radius: 4px;
    }
  }
}

@media (--media-mobile) {
  .occurrence-path {
    &__metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}
</style>
