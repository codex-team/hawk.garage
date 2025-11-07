<template>
  <div class="projects-menu-skeleton">
    <div
      v-for="i in count"
      :key="i"
      class="projects-menu-skeleton__item"
    >
      <SkeletonAvatar
        size="small"
        class="projects-menu-skeleton__picture"
      />
      <div class="projects-menu-skeleton__info">
        <SkeletonBar
          class="projects-menu-skeleton__name"
          width="120px"
          size="medium"
        />
        <SkeletonBar
          class="projects-menu-skeleton__last-event"
          width="160px"
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SkeletonAvatar from '../utils/SkeletonAvatar.vue';
import SkeletonBar from '../utils/SkeletonBar.vue';

/**
 * Skeleton loader for projects menu items
 */
export default Vue.extend({
  name: 'ProjectsMenuSkeleton',
  components: {
    SkeletonAvatar,
    SkeletonBar,
  },
  props: {
    /**
     * Number of skeleton items to display
     */
    count: {
      type: Number,
      default: 5,
    },
  },
});
</script>

<style>
.projects-menu-skeleton {
  &__item {
    display: flex;
    justify-content: flex-start;
    max-height: 62px;
    margin: 5px 10px;
    padding: 8px 10px;
    border-radius: var(--border-radius);
  }

  &__picture {
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    margin-right: 15px;
  }

  &__info {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
  }

  &__name {
    margin-bottom: 0;
  }

  &__last-event {
    margin-bottom: 0;
  }
}
</style>

