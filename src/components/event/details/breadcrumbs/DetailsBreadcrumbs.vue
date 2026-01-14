<template>
  <DetailsBase>
    <template #header>
      Breadcrumbs
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
          <svg
            viewBox="0 0 16 16"
            class="breadcrumbs__expand-icon"
          >
            <path
              fill="currentColor"
              d="M3 6h2v2H3V6zm0 4h2v2H3v-2zM7 6h2v2H7V6zm0 4h2v2H7v-2zm4-4h2v2h-2V6zm0 4h2v2h-2v-2z"
            />
          </svg>
          {{ showAll ? 'Show Less' : 'View All' }}
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

interface Props {
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
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }
}
</style>
