<template>
  <div class="event-header-navigation">
    <div
      v-for="item in items"
      :key="item.title"
      class="event-header-navigation__item"
      :class="isActive(item.title) ? 'event-header-navigation__item--active' : ''"
      @click="onNavigationItemClick(item)"
    >
      {{ $t(`event.navigation.${item.title}`) }}
      <Badge
        v-if="item.badge !== null"
        class="event-header-navigation__item-count"
        type="visited"
        :content="item.badge"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Badge from '../utils/Badge.vue';

export default Vue.extend({
  name: 'EventHeaderNavigation',
  components: {
    Badge,
  },
  props: {
    /**
     * Navigation items
     * @type {Array}
     */
    items: {
      type: Array as () => any[],
      default: () => [],
    },
  },
  data() {
    return {
      /**
       * Active navigation item
       * @type {string}
       */
      activeItem: 'overview',

      /**
       * Active navigation item link
       * @type {string}
       */
      activeItemLink: 'event-overview',
    };
  },
  created() {
    const path = this.$route.path.split('/').pop();
    const item = this.items.find(item => item.title === path);

    if (item) {
      this.activeItem = item.title;
      this.activeItemLink = item.link;

      this.$emit('tabChanged', {
        title: this.activeItem,
      });
    }
  },
  methods: {
    /**
     * Check if navigation item is active
     * @param {String} navigationItem - navigation item
     *
     * @return {boolean}
     */
    isActive(navigationItem: string): boolean {
      return this.activeItem === navigationItem;
    },

    /**
     * Set navigation item as active
     * @param {Object} navigationItem - navigation item
     */
    setActive(navigationItem: any) {
      this.activeItem = navigationItem.title;
      this.activeItemLink = navigationItem.link;
    },

    /**
     * Event for navigation item click
     * @param {Object} navigationItem - navigation item
     */
    onNavigationItemClick(navigationItem: any) {
      if (!this.isActive(navigationItem.title)) {
        this.setActive(navigationItem);
        this.$emit('tabChanged', {
          title: this.activeItem,
          link: this.activeItemLink,
        });
      }
    },
  },
});
</script>

<style>
  .event-header-navigation {
      display: flex;
      font-weight: 500;
      letter-spacing: 0.37px;

      &__item {
        display: flex;
        align-items: center;
        margin-right: 25px;
        font-size: 14.6px;
        cursor: pointer;
        opacity: 0.6;

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
          transition: opacity 500ms;

          &::before {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 3px;
            background-color: var(--color-indicator-medium);
            border-radius: 1.5px 1.5px 0 0;
            content: '';
          }
        }
      }

      &-item:last-child {
        margin-right: 0;
      }
  }
</style>
