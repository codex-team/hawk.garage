<template>
  <div class="filters-bar">
    <div class="filters-bar__section">
      <div class="filters-bar__name">
        <Icon
          symbol="filter"
          class="filters-bar__filter-icon"
        />
        Filter
      </div>
      <FlatButton
        v-for="(value, key) in filtersOptions"
        :key="key"
        :content="value.label"
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
        Sort
      </div>
      <FlatButton
        v-for="(value, key) in sortOptions"
        :key="key"
        :content="value"
        :active="key === order"
        class="filters-bar__button"
        small
        @click="selectOrder(key)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import FlatButton from '../utils/FlatButton.vue';
import Icon from '../utils/Icon.vue';
import { EventsFilters, EventsSortOrder } from '../../types/events';
import { SET_EVENTS_FILTERS, SET_EVENTS_ORDER } from '../../store/modules/events/actionTypes';

export default {
  name: 'FiltersBar',
  components: {
    Icon,
    FlatButton,
  },
  data() {
    return {
      filtersOptions: {
        all: {
          label: 'All',
          filters: {
            default: true,
            starred: true,
            ignored: true,
            resolved: true,
          },
        },
        starred: {
          label: 'Starred',
          filters: {
            default: false,
            starred: true,
            ignored: false,
            resolved: false,
          },
        },
        resolved: {
          label: 'Resolved',
          filters: {
            default: false,
            starred: false,
            ignored: false,
            resolved: true,
          },
        },
        unresolved: {
          label: 'Unresolved',
          filters: {
            default: true,
            starred: true,
            ignored: true,
            resolved: false,
          },
        },
        hidden: {
          label: 'Hidden',
          filters: {
            default: false,
            starred: false,
            resolved: false,
            ignored: true,
          },
        },
      },
      sortOptions: {
        [EventsSortOrder.ByDate]: 'By date',
        [EventsSortOrder.ByCount]: 'By count',
      },
    };
  },
  computed: {
    filters(): EventsFilters {
      return this.$store.getters.getProjectFilters(this.projectId);
    },
    order(): EventsSortOrder {
      return this.$store.getters.getProjectOrder(this.projectId);
    },
    selectedFilter() {
      let filter = 'all';

      Object.entries(this.filtersOptions).some(([key, { filters } ]) => {
        const isEqual = Object
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

      return filter;
    },
    projectId() {
      return this.$route.params.projectId;
    },
  },
  methods: {
    selectFilter(key: string) {
      if (key === this.selectedFilter) {
        return;
      }

      const filters = this.filtersOptions[key].filters;

      this.$store.dispatch(SET_EVENTS_FILTERS, {
        filters,
        projectId: this.projectId,
      });
    },
    selectOrder(key: EventsSortOrder) {
      if (key === this.order) {
        return;
      }

      this.$store.dispatch(SET_EVENTS_ORDER, {
        order: key,
        projectId: this.projectId,
      });
    },
  },
};
</script>

<style>
  .filters-bar {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 25px;
    padding: 0 21px;
  }

  .filters-bar__section {
    display: flex;
    align-items: center;
  }

  .filters-bar__name {
    display: flex;
    align-items: center;
    font-weight: 600;

    font-size: 12px;
    letter-spacing: 0.15px;
    text-transform: uppercase;
  }

  .filters-bar__filter-icon {
    width: 12px;
    height: 10px;
    margin-right: 6px;
  }
  .filters-bar__sort-icon {
    width: 10px;
    height: 10px;
    margin-right: 7px;
  }

  .filters-bar__button {
    margin-left: 3px;

    &:first-of-type {
       margin-left: 10px;
    }
  }
</style>
