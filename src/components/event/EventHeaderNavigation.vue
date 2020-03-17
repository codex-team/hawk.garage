<template>
  <div class="event-overview__navigation">
    <div
      class="event-overview__navigation-item"
      :class="setActiveClass('overview')"
      @click="onNavigationItemClick('overview')"
    >
      {{ $t('events.navigation.overview') }}
    </div>
    <div
      class="event-overview__navigation-item"
      :class="setActiveClass('repetitions')"
      @click="onNavigationItemClick('repetitions')"
    >
      {{ $t('events.navigation.repetitions') }}
      <Badge
        class="event-overview__navigation-count"
        type="visited"
        :content="!loading ? event.totalCount : ' '"
      />
    </div>
    <div
      class="event-overview__navigation-item"
      :class="setActiveClass('daily')"
      @click="onNavigationItemClick('daily')"
    >
      {{ $t('events.navigation.daily') }}
      <Badge
        class="event-overview__navigation-count"
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
      return (this.isActive(navigationItem)) ? 'event-overview__navigation--active' : '';
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
  .event-overview {

    &__navigation {
      display: flex;
      letter-spacing: 0.37px;
      font-weight: 500;

      &-count {
        margin-left: 10px;
        padding: 4px 8px;
        font-size: 12.6px;
        font-weight: bold;
        letter-spacing: 0.32px;
        color: var(--color-text-main);
      }

      &-item {
        display: flex;
        align-items: center;
        font-size: 14.6px;
        cursor: pointer;
        margin-right: 25px;
        opacity: 0.6;
      }

      &-item:last-child {
        margin-right: 0;
      }

      &--active {
        position: relative;
        opacity: 1;
        transition: opacity 500ms;

        &::before {
          content: '';
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 3px;
          border-radius: 1.5px 1.5px 0 0;
          background-color: var(--color-indicator-medium);
        }
      }
    }
  }
</style>
