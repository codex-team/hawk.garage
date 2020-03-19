<template>
  <div class="event-header-navigation">
    <div
      class="event-header-navigation__item"
      :class="setActiveClass('overview')"
      @click="onNavigationItemClick('overview')"
    >
      {{ $t('events.navigation.overview') }}
    </div>
    <div
      class="event-header-navigation__item"
      :class="setActiveClass('repetitions')"
      @click="onNavigationItemClick('repetitions')"
    >
      {{ $t('events.navigation.repetitions') }}
      <Badge
        class="event-header-navigation__item-count"
        type="visited"
        :content="!loading ? event.totalCount : ' '"
      />
    </div>
    <div
      class="event-header-navigation__item"
      :class="setActiveClass('daily')"
      @click="onNavigationItemClick('daily')"
    >
      {{ $t('events.navigation.daily') }}
      <Badge
        class="event-header-navigation__item-count"
        type="visited"
        content="0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Badge from '../utils/Badge.vue';
import { HawkEvent } from '@/types/events';

export default Vue.extend({
  name: 'EventHeaderNavigation',
  components: {
    Badge,
  },
  props: {
    /**
     * Original (first) event data
     * @type {HawkEvent}
     */
    event: {
      type: Object as () => HawkEvent,
      default: null,
      validator: prop => typeof prop === 'object' || prop === null,
    },
  },
  data() {
    return {
      /**
       * Active menu item
       * @type {string}
       */
      activeItem: 'overview',

      /**
       * Status of repetition-diff fetching
       * @type {boolean}
       */
      loading: !this.event,
    };
  },
  watch: {
    /**
     * When event is changed
     */
    event() {
      this.loading = false;
    },
  },
  created() {
    const path = this.$route.path.split('/').pop();

    if (path === 'repetitions' || path === 'daily') {
      this.activeItem = path;
    }

    this.$emit('tabChanged', this.activeItem);
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
     * @param {String} navigationItem - navigation item
     */
    setActive(navigationItem: string) {
      this.activeItem = navigationItem;
    },

    /**
     * Set class for active navigation item
     * @param {String} navigationItem - navigation item
     *
     * @return {string}
     */
    setActiveClass(navigationItem: string): string {
      return (this.isActive(navigationItem)) ? 'event-header-navigation__item--active' : '';
    },

    /**
     * Event for navigation item click
     * @param {String} navigationItem - navigation item
     */
    onNavigationItemClick(navigationItem: string) {
      const eventId = this.$route.params.eventId;
      const projectId = this.$route.params.projectId;

      if (!this.isActive(navigationItem)) {
        this.setActive(navigationItem);
        this.$emit('tabChanged', navigationItem);
        this.$router.push({
          name: this.routerName(navigationItem),
          params: {
            projectId,
            eventId,
          },
        });
      }
    },

    /**
     * Concrete router name for event navigation
     * @param {String} navigationItem - navigation item
     *
     * @return {string}
     */
    routerName(navigationItem: string): string {
      const name = 'event-overview';

      if (navigationItem !== 'overview') {
        return name + '-' + navigationItem;
      }

      return name;
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
