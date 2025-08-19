<template>
  <div class="tab-bar">
    <div
      v-for="item in items"
      :key="item.title"
      class="tab-bar__item"
      :class="{
        'tab-bar__item--active': isActive(item)
      }"
      @click="onNavigationItemClick(item)"
    >
      {{ item.title }}
      <Badge
        v-if="item.badge"
        class="tab-bar__item-count"
        type="silent"
        :content="item.badge"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Badge from './Badge.vue';

/**
 * Information about single tab button
 */
export interface TabInfo {
  /**
   * Text on tab
   */
  title: string;

  /**
   * Where to go
   */
  routeName: string;

  /**
   * Optional counter for the badge
   */
  badge?: number,
}

export default Vue.extend({
  name: 'TabBar',
  components: {
    Badge,
  },
  props: {
    /**
     * Navigation items
     */
    items: {
      type: Array as () => TabInfo[],
      default: () => [],
    },

    /**
     * Index of item that should be highlighted
     */
    activeItemIndex: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    /**
     * Check if navigation item is active
     *
     * @param item - navigation item info
     *
     * @returns {boolean}
     */
    isActive(item: TabInfo): boolean {
      return this.items.indexOf(item) === this.activeItemIndex;
    },

    /**
     * Handle clicks on navigation item
     *
     * @param item - clicked navigation item
     */
    onNavigationItemClick(item: TabInfo) {
      this.$router.push({
        name: item.routeName,
        params: this.$route.params,
      });
    },
  },
});
</script>

<style>
  .tab-bar {
    display: flex;
    height: 50px;
    font-weight: 500;
    letter-spacing: 0.37px;

    &__item {
      display: flex;
      align-items: center;
      margin-right: 25px;
      color: var(--color-text-second);
      font-size: 14.6px;
      white-space: nowrap;
      cursor: pointer;
      transition: color 200ms;

      &:hover,
      &--active {
        color: var(--color-text-main);
      }

      &-count {
        margin-left: 10px;
        padding: 4px 8px;
        color: var(--color-text-main);
        font-weight: bold;
        font-size: 12.6px;
        letter-spacing: 0.32px;
      }

      &--active {
        position: relative;
        opacity: 1;

        &::before {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 3px;
          background-color: var(--color-indicator-medium);
          border-radius: 3px 3px 0 0;
          content: '';
        }
      }
    }

    &-item:last-child {
      margin-right: 0;
    }
  }
</style>
