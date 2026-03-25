<template>
  <div class="events-list">
    <SearchField
      v-model="searchQuery"
      class="events-list__search search-container"
      skin="fancy"
      :placeholder="searchFieldPlaceholder"
      :is-c-m-d-k-enabled="true"
    >
      <template #suffix>
        <UiSelect
          v-model="selectedAssigneeId"
          class="events-list__assignee-filter"
          :class="{ 'events-list__assignee-filter--all': !selectedAssigneeId }"
          :icon-left="selectedAssigneeId ? undefined : 'user-small'"
          :options="assigneeOptions"
          :placeholder="$t('event.viewedBy.assignee')"
        />
      </template>
    </SearchField>
    <template v-if="hasItems">
      <div
        v-for="(eventsByDate, date) in groupedByDate"
        :key="date"
        class="events-list__group"
      >
        <div class="events-list__date">
          {{ formatGroupDate(date) }}
        </div>
        <EventItem
          v-for="(dailyEventInfo, index) in eventsByDate"
          :key="`${dailyEventInfo.groupHash}-${date}-${index}`"
          :last-occurrence-timestamp="getEvent(dailyEventInfo.eventId).timestamp"
          :count="dailyEventInfo.count"
          :affected-users-count="dailyEventInfo.affectedUsers"
          class="events-list__event"
          :event="getEvent(dailyEventInfo.eventId)"
          @on-assignee-icon-click="onAssigneeIconClick(dailyEventInfo.eventId, $event)"
          @show-event-overview="onShowEventOverview(dailyEventInfo.eventId)"
        />
      </div>
      <div
        v-if="!noMore && !isLoading"
        class="events-list__load-more"
        @click="loadMoreEvents(false)"
      >
        <span>{{ $t('projects.loadMoreEvents') }}</span>
      </div>
    </template>
    <div v-else-if="isLoading">
      <EventItemSkeleton />
    </div>
    <div
      v-else
      class="events-list__no-events-placeholder"
    >
      <EmptyState
        v-if="fallback === 'fancy-release'"
        icon="like"
        :title="$t('projects.releases.empty.eventsTitle')"
        :description="$t('projects.releases.empty.eventsDesc')"
      />
      <template v-else-if="fallback === 'simple'">
        <div class="events-list__divider" />
        {{ $t('projects.noEventsPlaceholder') }}
      </template>
    </div>
    <AssigneesList
      v-if="isAssigneesShowed"
      v-click-outside="hideAssigneesList"
      :style="assigneesListPosition"
      :event-id="assigneesEventId"
      :project-id="projectId"
      class="events-list__assignees-list"
      @hide="hideAssigneesList"
    />
  </div>
</template>

<script>
import EventItem from './EventItem';
import EventItemSkeleton from './EventItemSkeleton';
import { groupByGroupingTimestamp, debounce, getPlatform } from '@/utils';
import { prettyDate } from '@/utils/filters';
import AssigneesList from '../event/AssigneesList';
import { mapGetters } from 'vuex';
import { FETCH_PROJECT_OVERVIEW } from '../../store/modules/events/actionTypes';
import SearchField from '../forms/SearchField';
import EmptyState from '../utils/EmptyState.vue';
import UiSelect from '../utils/UiSelect.vue';

/** Must match api/src/models/eventsFactory.js assignee filter sentinels */
const ASSIGNEE_FILTER_UNASSIGNED = '__filter_unassigned__';
const ASSIGNEE_FILTER_ANY_ASSIGNEE = '__filter_any_assignee__';

/**
 * Events list component grouped by days.
 *
 * Renders:
 * - date headers (prettyDate) for each group
 * - event items via `EventItem`
 * - loading skeleton or placeholder when there is no data
 * - a Load More button if more data is available
 *
 * Emits:
 * - `loadMore` — request the next portion of events
 * - `assigneeIconClick` — assignee icon/avatar click; payload: { projectId, eventId, nativeEvent }
 * - `showEventOverview` — open event overview; payload: { projectId, eventId, originalEventId }
 */
export default {
  name: 'EventsList',
  components: {
    EventItem,
    EventItemSkeleton,
    AssigneesList,
    SearchField,
    EmptyState,
    UiSelect,
  },
  props: {
    fallback: {
      type: String,
      default: 'simple',
    },
  },
  data() {
    return {
      /**
       * Pagination cursor for next dailyEvents portion
       */
      dailyEventsNextCursor: null,
      /**
       * Current search query (controlled input for SearchField)
       */
      searchQuery: (this.$store && this.$store.getters && this.$route)
        ? (this.$store.getters.getProjectSearch(this.$route.params.projectId) || '')
        : '',
      /**
       * Raw (not grouped by groupingTimestamp) dailyEvents list
       */
      dailyEvents: [],
      /**
       * Selected assignee id for filtering events
       */
      selectedAssigneeId: '',
      /**
       * Indicates whether items are loading or not.
       */
      isLoading: false,
      /**
       * Shows if there are no more events or there are
       */
      noMore: false,
      /**
       * Indicates whether assignees list is shown
       */
      isAssigneesShowed: false,
      /**
       * Debounced search handler
       */
      debouncedSearch: null,
      /**
       * Id of the event which assignees are shown
       */
      assigneesEventId: '',
      /**
       * Assignees list position in pixels
       */
      assigneesListPosition: {
        top: 0,
        left: 0,
      },
      /**
       * Handler of window resize
       */
      onResize: () => {
        // do nothing
      },
      /**
       * Old window width
       */
      windowWidth: window.innerWidth,
      /**
       * Anchor element for assignees popup positioning
       */
      assigneesAnchorEl: null,
      /**
       * When true, run reloadDailyEvents once the current load finishes (assignee changed mid-request)
       */
      pendingAssigneeReload: false,
    };
  },
  created() {
    this.loadMoreEvents(true);

    const SEARCH_MAX_LENGTH = 50;

    this.debouncedSearch = debounce((query) => {
      const sanitized = typeof query === 'string' ? query.slice(0, SEARCH_MAX_LENGTH) : '';

      if (this.projectId) {
        this.$store.commit('SET_PROJECT_SEARCH', {
          projectId: this.projectId,
          search: sanitized,
        });
      }

      this.reloadDailyEvents();
    }, 500);
  },
  beforeUnmount() {
    this.debouncedSearch && this.debouncedSearch.cancel && this.debouncedSearch.cancel();
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    /**
     * Placeholder for search input with CMD/Ctrl+K hint
     */
    searchFieldPlaceholder() {
      return this.$t('forms.searchFieldWithCMDK', {
        cmd: getPlatform() === 'macos' ? '⌘' : 'Ctrl',
      });
    },
    /**
     * Returns project id from the route
     *
     * @returns {string}
     */
    projectId() {
      return this.$route.params.projectId;
    },
    /**
     * Returns current release from the route (if any)
     *
     * @returns {string|undefined}
     */
    release() {
      return this.$route.params.release || this.$route.query?.release;
    },
    /**
     * Workspace for current project (contains team members)
     */
    workspace() {
      return this.$store.getters.getWorkspaceByProjectId(this.projectId);
    },
    /**
     * Assignee filter options (all + workspace users)
     */
    assigneeOptions() {
      const users = (this.workspace?.team || [])
        .map(member => member.user)
        .filter(Boolean);

      const options = users.map(user => ({
        label: user.name || user.email,
        value: String(user.id),
      }));

      return [
        {
          value: '',
          icon: 'user-small',
          label: this.$t('projects.filters.assigneeNoFilter'),
        },
        {
          value: ASSIGNEE_FILTER_UNASSIGNED,
          label: this.$t('projects.filters.assigneeUnassigned'),
        },
        {
          value: ASSIGNEE_FILTER_ANY_ASSIGNEE,
          label: this.$t('projects.filters.assigneeAny'),
        },
        ...options,
      ];
    },
    ...mapGetters(['getProjectEventById', 'getProjectSearch']),
    /**
     * Whether there are items to display
     *
     * @returns {boolean}
     */
    hasItems() {
      return Array.isArray(this.dailyEvents) && this.dailyEvents.length > 0;
    },
    /**
     * Group events by the `groupingTimestamp` key
     *
     * @returns {Record<string, any[]>}
     */
    groupedByDate() {
      if (!this.hasItems) {
        return {};
      }

      return groupByGroupingTimestamp(this.dailyEvents);
    },
  },
  methods: {
    /**
     * Return midnight timestamp extracted from grouping key
     *
     * @param {string} date - key like 'groupingTimestamp:1576011600'
     * @returns {number}
     */
    getDay(date) {
      return parseInt(date.replace('groupingTimestamp:', ''), 10);
    },
    /**
     * Return full event by its identifier
     *
     * @param {string} eventId
     * @returns {GroupedEvent}
     */
    getEvent(eventId) {
      return this.getProjectEventById(this.projectId, eventId);
    },
    /**
     * Format grouped date for displaying in headers.
     *
     * @param {string} date - grouping key like 'groupingTimestamp:1576011600'
     * @returns {string}
     */
    formatGroupDate(date) {
      return prettyDate(this.getDay(date));
    },
    /**
     * Load older events to the list
     *
     * @param overwrite - determine whenever we need to overwrite this.dailyEvents
     */
    async loadMoreEvents(overwrite) {
      if (this.isLoading === true) {
        return;
      }

      if (this.noMore) {
        return;
      }

      this.isLoading = true;
      const search = this.getProjectSearch(this.projectId) || '';

      const { nextCursor, dailyEventsWithEventsLinked } = await this.$store.dispatch(FETCH_PROJECT_OVERVIEW, {
        projectId: this.projectId,
        nextCursor: this.dailyEventsNextCursor,
        search,
        release: this.release,
        assignee: this.selectedAssigneeId || undefined,
      });

      this.dailyEventsNextCursor = nextCursor;
      this.noMore = this.dailyEventsNextCursor === null;

      if (this.noMore && dailyEventsWithEventsLinked.length === 0) {
        this.$emit('no-events');
      }

      if (overwrite) {
        this.dailyEvents = [...dailyEventsWithEventsLinked];
      } else {
        this.dailyEvents.push(...dailyEventsWithEventsLinked);
      }

      this.isLoading = false;
    },
    /**
     * Reset pagination and reload list
     */
    reloadDailyEvents() {
      this.dailyEventsNextCursor = null;
      this.noMore = false;
      this.loadMoreEvents(true);
    },
    /**
     * Handle assignee icon/avatar click and emit payload to parent
     *
     * @param {string} eventId
     * @param {MouseEvent} nativeEvent
     * @returns {void}
     */
    onAssigneeIconClick(eventId, nativeEvent) {
      const targetEl = nativeEvent && nativeEvent.target ? nativeEvent.target : null;
      const anchorEl = targetEl && targetEl.closest ? targetEl.closest('.event-item__assignee') : null;

      if (!anchorEl) {
        return;
      }

      const boundingClientRect = anchorEl.getBoundingClientRect();

      this.assigneesAnchorEl = anchorEl;

      this.isAssigneesShowed = true;
      this.assigneesEventId = eventId;
      this.assigneesListPosition = {
        top: `${boundingClientRect.top - 3}px`,
        left: `${boundingClientRect.left}px`,
      };
      this.windowWidth = window.innerWidth;
      this.onResize = this.setAssigneesPosition.bind(this);

      // TODO: Add throttle to the resize event
      window.addEventListener('resize', this.onResize);
      window.addEventListener('scroll', this.onResize, true);
    },
    /**
     * Emit identifiers to open event overview
     *
     * @param {string} eventId
     * @returns {void}
     */
    onShowEventOverview(eventId) {
      const event = this.getEvent(eventId);
      const originalEventId = event.originalEventId;

      if (this.isAssigneesShowed) {
        this.isAssigneesShowed = false;

        return;
      }

      this.$router.push({
        name: 'event-overview',
        params: {
          projectId: this.projectId,
          eventId: originalEventId,
          repetitionId: eventId,
        },
      });
    },
    /**
     * Set a new position when resizing the window
     */
    setAssigneesPosition() {
      if (!this.assigneesAnchorEl) {
        return;
      }
      const rect = this.assigneesAnchorEl.getBoundingClientRect();

      this.assigneesListPosition = {
        top: `${rect.top - 3}px`,
        left: `${rect.left}px`,
      };
      this.windowWidth = window.innerWidth;
    },
    /**
     * Hide assignees popup
     */
    hideAssigneesList() {
      this.isAssigneesShowed = false;
      window.removeEventListener('resize', this.onResize);
      window.removeEventListener('scroll', this.onResize, true);
    },
  },
  // eslint-disable-next-line vue/order-in-components
  watch: {
    searchQuery(newVal) {
      void this.debouncedSearch(newVal);
    },
    selectedAssigneeId() {
      if (this.isLoading) {
        this.pendingAssigneeReload = true;

        return;
      }
      this.pendingAssigneeReload = false;
      this.reloadDailyEvents();
    },
    isLoading(newVal) {
      if (!newVal && this.pendingAssigneeReload) {
        this.pendingAssigneeReload = false;
        this.reloadDailyEvents();
      }
    },
  },
};
</script>

<style>
.events-list {
  display: flex;
  flex-direction: column;

  &__group {
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
  &__assignees-list {
    position: fixed;
    transform: translateX(-100%) translate(-15px, -5px);
  }

  &__assignee-filter {
    flex-shrink: 0;
    /* Popover above event rows (assignee avatars stack high) */
    position: relative;
    z-index: 100;

    .ui-select__button {
      gap: 2px;
      color: var(--color-text-second) !important;
      font-weight: 500;
      background-color: transparent !important;
      border: none;
      box-shadow: none;

      &:hover {
        color: var(--color-text-main) !important;
        background-color: transparent !important;
      }
    }

    .ui-context-list {
      /* Override scoped UiSelect: align popover to trigger right edge, width from content (grows left) */
      z-index: 101;
      right: 0 !important;
      left: auto !important;
      width: max-content !important;
      min-width: 100%;
      max-width: min(420px, calc(100vw - 24px));
      box-sizing: border-box;
      background-color: var(--color-bg-main);
      border: 1px solid var(--color-border);

      .ui-context-list__item {
        max-width: 100%;
        white-space: normal;
        overflow-wrap: anywhere;
      }

      .ui-context-list__item:hover {
        background-color: var(--color-bg-third);
      }
    }
  }

  /* “All assignees” trigger: iconLeft + chevron only; label hidden via CSS (UiSelect unchanged) */
  &__assignee-filter--all .ui-select__button {
    font-size: 0;
    line-height: 0;
  }

  &__assignee-filter--all .ui-select__button .icon {
    width: 12px;
    height: 12px;
  }
}
.search-container {
  width: 100%;
  margin-top: 16px;

  &.form-search-field {
    position: relative;
    z-index: 100;
    padding-inline-end: 7px;
  }
}
</style>
