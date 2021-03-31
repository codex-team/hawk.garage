<template>
  <div class="filters-bar">
    <div class="filters-bar__section">
      <div class="filters-bar__name">
        <Icon
          symbol="filter"
          class="filters-bar__filter-icon"
        />
        {{ $t('projects.filters.filtersLabel') }}
      </div>
      <FlatButton
        v-for="(value, key) in filtersOptions"
        :key="key"
        :content="$t(`projects.filters.filtersOptions.${key}`)"
        :active="key === selectedFilter"
        small
        class="filters-bar__button"
        @click="selectFilter(key)"
      />
    </div>
    <div class="filters-bar__section">
      <div class="filters-bar__name">
        <Icon
          symbol="sort"
          class="filters-bar__sort-icon"
        />
        {{ $t('projects.filters.sortLabel') }}
      </div>
      <FlatButton
        v-for="(value, key) in sortOptions"
        :key="key"
        :content="$t(`projects.filters.sortOptions.${value}`)"
        :active="key === order"
        class="filters-bar__button"
        small
        @click="selectOrder(key)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FlatButton from '../utils/FilterButton.vue';
import Icon from '../utils/Icon.vue';
import { EventsFilters, EventsSortOrder } from '../../types/events';
import { SET_EVENTS_FILTERS, SET_EVENTS_ORDER } from '../../store/modules/events/actionTypes';

interface FiltersBarData {
  /**
   * Each property contains events filters combination to fit the condition
   */
  filtersOptions: {
    all: EventsFilters,
    starred: EventsFilters,
    resolved: EventsFilters,
    unresolved: EventsFilters,
    ignored: EventsFilters
  },
  sortOptions: {
    [K in EventsSortOrder]: string
  }
}

export default Vue.extend({
  name: 'FiltersBar',
  components: {
    Icon,
    FlatButton,
  },
  data(): FiltersBarData {
    return {
      /**
       * Available filter options
       */
      filtersOptions: {
        all: {},
        starred: {
          starred: true,
        },
        resolved: {
          resolved: true,
        },
        unresolved: {
          resolved: false,
        },
        ignored: {
          ignored: true,
        },
      },
      /**
       * Available sort options
       */
      sortOptions: {
        [EventsSortOrder.ByDate]: 'byDate',
        [EventsSortOrder.ByCount]: 'byCount',
      },
    };
  },
  computed: {
    /**
     * Get events filters from VueX store
     */
    filters(): EventsFilters {
      return this.$store.getters.getProjectFilters(this.projectId);
    },
    /**
     * Get events sorting order from VueX store
     */
    order(): EventsSortOrder {
      return this.$store.getters.getProjectOrder(this.projectId);
    },
    /**
     * Get key for selected filters
     */
    selectedFilter(): keyof FiltersBarData['filtersOptions'] {
      let filter = 'all';

      Object.entries(this.filtersOptions).some(([key, filters]) => {
        const isLengthsEqual = Object.values(filters).length === Object.values(this.filters).length;

        const isEqual = isLengthsEqual && Object
          .entries(filters)
          .reduce((acc, [mark, value]) => {
            return acc && this.filters[mark] === value;
          }, true);

        if (isEqual) {
          filter = key;

          return true;
        }

        return false;
      });

      return filter as keyof FiltersBarData['filtersOptions'];
    },
    /**
     * Get project id from URL parameters
     */
    projectId(): string {
      return this.$route.params.projectId;
    },
  },
  methods: {
    /**
     * Set new events filters
     *
     * @param {string} key - filters key
     */
    selectFilter(key: string): void {
      if (key === this.selectedFilter) {
        return;
      }

      const filters = this.filtersOptions[key];

      this.$store.dispatch(SET_EVENTS_FILTERS, {
        filters,
        projectId: this.projectId,
      });
    },
    /**
     * Set new events sorting order
     *
     * @param {EventsSortOrder} key - sorting order key
     */
    selectOrder(key: EventsSortOrder): void {
      if (key === this.order) {
        return;
      }

      this.$store.dispatch(SET_EVENTS_ORDER, {
        order: key,
        projectId: this.projectId,
      });
    },
  },
});
</script>

<style>
  .filters-bar {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 25px;
    padding: 0 21px;

    &__section {
      display: flex;
      align-items: center;
    }

    &__name {
      display: flex;
      align-items: center;
      font-weight: 600;

      font-size: 12px;
      letter-spacing: 0.15px;
      text-transform: uppercase;
    }

    &__filter-icon {
      width: 12px;
      height: 10px;
      margin-right: 6px;
      color: var(--color-text-second);
    }

    &__sort-icon {
      width: 10px;
      height: 10px;
      margin-right: 7px;
      color: var(--color-text-second);
    }

    &__button {
      margin-left: 3px;

      &:first-of-type {
        margin-left: 10px;
      }
    }
  }
</style>
