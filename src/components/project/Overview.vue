<template>
  <div class="project-overview">
    <div
      v-if="project"
      v-infinite-scroll="() => loadMoreEvents(false)"
      :infinite-scroll-disabled="false"
      infinite-scroll-distance="300"
      class="project-overview__content"
    >
      <Chart
        :points="chartData"
      />
      <FiltersBar
        @state-changed="reloadDailyEvents"
      />
      <!-- TODO: Add placeholder if there is no filtered events -->
      <div class="project-overview__events">
        <BlockedWorkspaceBanner
          v-if="isWorkspaceBlocked"
          :workspace-name="workspace.name"
          :workspace-id="workspace.id"
        />
        <EventsList ref="eventsList" />
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import EventsList from './EventsList.vue';
import Chart from '../events/Chart';
import { mapGetters } from 'vuex';
import {
  FETCH_CHART_DATA
} from '../../store/modules/projects/actionTypes';
import FiltersBar from './FiltersBar';
import notifier from 'codex-notifier';
import NotFoundError from '@/errors/404';
import BlockedWorkspaceBanner from '../utils/BlockedWorkspaceBanner.vue';

/**
 * Maximum length of the search query
 */
const SEARCH_MAX_LENGTH = 50;

export default {
  name: 'ProjectOverview',
  components: {
    FiltersBar,
    EventsList,
    Chart,
    BlockedWorkspaceBanner,
  },
  data() {
    return {
      /**
       * Data for a chart
       */
      chartData: [],

    };
  },
  computed: {
    /**
     * Returns project id from the route
     *
     * @returns {string}
     */
    projectId() {
      return this.$route.params.projectId;
    },

    /**
     * Current viewed project
     *
     * @returns {Project}
     */
    project() {
      const project = this.$store.getters.getProjectById(this.projectId);

      return project;
    },

    /**
     * Current workspace
     */
    workspace() {
      if (!this.project) {
        return null;
      }

      return this.$store.getters.getWorkspaceById(this.project.workspaceId);
    },

    /**
     * Check if workspace is blocked
     */
    isWorkspaceBlocked() {
      return this.workspace?.isBlocked;
    },
  },

  /**
   * Vue created hook
   * Used to fetch events on component creation
   */
  async created() {
    try {
      // How many days will be displayed in the chart
      const twoWeeks = 14;
      const boundingDays = 2;

      if (!this.$store.state.projects.charts[this.projectId]) {
        await this.$store.dispatch(FETCH_CHART_DATA, {
          projectId: this.projectId,
          days: twoWeeks + boundingDays,
        });
      }

      this.chartData = this.$store.state.projects.charts[this.projectId];
    } catch (error) {
      if (error instanceof NotFoundError) {
        notifier.show({
          message: this.$t('projects.notFound'),
          style: 'error',
          time: 5000,
        });

        /**
         * @todo Make 404 page and Redirect to it
         */
        this.$router.push('/');

        return;
      }

      /**
       * In case of not-404 error, throw it down
       */
      throw error;
    }
  },

  unmounted() {
    this.$store.commit('SET_PROJECT_SEARCH', {
      projectId: this.projectId,
      search: '',
    });

    /** Clear search query when component is unmounted */
    this.$store.commit('SET_PROJECT_SEARCH', {
      projectId: this.projectId,
      search: '',
    });
  },

  methods: {
    /**
     * Load older events to the list
     *
     * @param overwrite - determine whenever we need to overwrite this.dailyEvents
     */
    async loadMoreEvents(overwrite) {
      if (this.$refs.eventsList && this.$refs.eventsList.loadMoreEvents) {
        this.$refs.eventsList.loadMoreEvents(overwrite);
      }
    },

    async reloadDailyEvents() {
      if (this.$refs.eventsList && this.$refs.eventsList.reloadDailyEvents) {
        this.$refs.eventsList.reloadDailyEvents();
      }
    },
  },
};
</script>

<style>
  @import '../../styles/custom-properties.css';

.project-overview {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  &__content {
    align-self: stretch;
    overflow-y: auto;
    @mixin hide-scrollbar;
  }

  &__events {
    display: flex;
    flex-direction: column;
    padding: 0 var(--layout-padding-inline) 15px;
  }

  &__events-by-date {
    margin-top: 25px;
  }

  &__date {
    margin-bottom: 20px;
    margin-left: 11px;
    color: var(--color-text-second);
    font-size: 14px;
  }

  &__event {
    cursor: pointer;
  }

  &__load-more {
    height: 46px;
    margin-top: 50px;
    padding: 13px 11px 13px 15px;
    font-weight: 500;
    line-height: 20px;
    background-color: var(--color-bg-main);
    border-radius: 9px;
    cursor: pointer;
  }

  &__no-events-placeholder {
    color: var(--color-text-second);
    font-size: 14px;
    letter-spacing: 0;
  }

  &__divider {
    width: 68px;
    height: 3px;
    margin: 40px 0 20px;
    background: var(--color-text-second);
    border-radius: 2px;
  }
}

</style>
