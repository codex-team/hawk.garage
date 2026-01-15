<template>
  <DetailsBase>
    <template #header>
      {{ $t('event.breadcrumbs.title') }}
    </template>
    <template #content>
      <div class="breadcrumbs">
        <BreadcrumbItem
          v-for="(breadcrumb, index) in displayedBreadcrumbs"
          :key="index"
          :breadcrumb="breadcrumb"
        />

        <div
          v-if="hasMore"
          class="event-details__expand"
          @click="toggleShowAll"
        >
          <Icon
            class="breadcrumbs__expand-icon"
            symbol="arrow-down"
            :class="{ 'breadcrumbs__expand-icon--opened': showAll }"
          />
          {{ showAll ? $t('event.breadcrumbs.showLess') : $t('event.breadcrumbs.viewAll') }}
        </div>
      </div>
    </template>
  </DetailsBase>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Breadcrumb } from '@hawk.so/types';
import DetailsBase from '../DetailsBase.vue';
import BreadcrumbItem from './BreadcrumbItem.vue';
import Icon from '../../../utils/Icon.vue';

/**
 * Props for DetailsBreadcrumbs component
 */
interface Props {
  /**
   * Array of breadcrumbs to display
   */
  breadcrumbs: Breadcrumb[];
}

const props = defineProps<Props>();

const showAll = ref(false);
const INITIAL_LIMIT = 5;

const sortedBreadcrumbs = computed(() => {
  return [...props.breadcrumbs].sort((a, b) => b.timestamp - a.timestamp);
});

const displayedBreadcrumbs = computed(() => {
  if (showAll.value || sortedBreadcrumbs.value.length <= INITIAL_LIMIT) {
    return sortedBreadcrumbs.value;
  }

  return sortedBreadcrumbs.value.slice(0, INITIAL_LIMIT);
});

const hasMore = computed(() => {
  return sortedBreadcrumbs.value.length > INITIAL_LIMIT;
});

const toggleShowAll = () => {
  showAll.value = !showAll.value;
};
</script>

<style>
.breadcrumbs {
  position: relative;
  border-radius: 10px;

  &__expand-icon {
    width: 12px;
    height: 12px;
    margin-right: 10px;
    margin-left: 5px;
    transition: transform 0.2s;

    &--opened {
      transform: rotate(180deg);
    }
  }
}
</style>
