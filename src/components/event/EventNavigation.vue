<template>
  <div class="event-overview__navigation">
    <span
      class="event-overview__navigation-text"
      :class="setActiveClass('overview')"
      @click="onNavigationItemClick('overview')"
    >
      Overview
    </span>
    <span
      class="event-overview__navigation-text"
      :class="setActiveClass('repetitions')"
      @click="onNavigationItemClick('repetitions')"
    >
      Repetitions
    </span>
    <Badge
      class="event-overview__navigation-count"
      type="visited"
      :content="event.totalCount"
    />
    <span
      class="event-overview__navigation-text"
      :class="setActiveClass('daily')"
      @click="onNavigationItemClick('daily')"
    >
      Days repeating
    </span>
    <Badge
      class="event-overview__navigation-count"
      type="visited"
      content="15"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Badge from '../utils/Badge.vue';

export default Vue.extend({
  name: 'EventNavigation',
  components: {
    Badge,
  },
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  data() {
    const path = this.$route.path.split('/').pop();
    let activeItem = 'overview';

    if (path === 'repetitions' || path === 'daily') {
      activeItem = path;
    }

    return {
      /**
       * Active menu item
       * @type {string}
       */
      activeItem,
    };
  },
  created() {
    this.$emit('toggleItem', this.activeItem);
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
        this.$emit('toggleItem', navigationItem);
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
     * Correct router name for event navigation
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
      align-items: center;
      font-size: 14.6px;
      letter-spacing: 0.37px;
      font-weight: 500;

      &-count {
        margin-right: 30px;
        padding: 4px 8px;
        font-size: 12.6px;
        font-weight: bold;
        letter-spacing: 0.32px;
        opacity: 0.6;
        color: var(--color-text-main);
      }

      &-text {
        cursor: pointer;
        margin-right: 10px;
        opacity: 0.6;
      }

      &-text:first-child {
        margin-right: 30px;
      }

      &--active {
        position: relative;
        opacity: 1;
        transition: opacity 500ms;

        &::before {
          content: '';
          position: absolute;
          bottom: -17px;
          width: 100%;
          height: 3px;
          border-radius: 1.5px;
          background-color: var(--color-indicator-medium);
        }
      }
    }
  }
</style>
