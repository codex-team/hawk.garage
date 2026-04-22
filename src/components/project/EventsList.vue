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
    <div
      v-if="workspace && !workspace.isBlocked"
      class="events-list__bulk-slot"
    >
      <div
        v-show="selectionModeActive"
        class="events-list__bulk-bar"
      >
        <div class="events-list__bulk-meta">
          <button
            type="button"
            class="ui-button ui-button--small ui-button--secondary events-list__bulk-cancel-combo"
            @click="exitBulkSelect"
          >
            <span class="ui-button-text">{{ $t('components.confirmationWindow.cancel') }}</span>
            <span class="ui-button-text events-list__bulk-cancel-esc">{{ $t('common.escKey') }}</span>
          </button>
          <span class="events-list__bulk-count">{{ $t('common.selected') }}: {{ selectedCount }}</span>
        </div>
        <div class="events-list__bulk-actions">
          <UiButton
            :content="$t('event.resolve')"
            icon="checkmark"
            small
            :disabled="selectedCount === 0 || bulkActionLoading"
            @click="runBulkMark('resolved')"
          />
          <UiButton
            :content="$t('event.ignore')"
            icon="hided"
            small
            :disabled="selectedCount === 0 || bulkActionLoading"
            @click="runBulkMark('ignored')"
          />
          <UiButton
            :content="$t('event.bulk.assignee')"
            icon="assignee"
            small
            :disabled="selectedCount === 0 || bulkActionLoading"
            @click="onBulkAssignButtonClick"
          />
        </div>
      </div>
    </div>
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
          :selection-mode-active="selectionModeActive"
          :row-selected="isRowSelected(dailyEventInfo.eventId)"
          :bulk-adjacent-top="!!bulkAdjacentByEventId[dailyEventInfo.eventId]?.top"
          :bulk-adjacent-bottom="!!bulkAdjacentByEventId[dailyEventInfo.eventId]?.bottom"
          @on-assignee-icon-click="onAssigneeIconClick(dailyEventInfo.eventId, $event)"
          @toggle-row-select="toggleRowSelected(dailyEventInfo.eventId)"
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
    <AssigneesList
      v-if="isBulkAssigneesShowed"
      v-click-outside="hideBulkAssigneesList"
      :style="bulkAssigneesListPosition"
      :project-id="projectId"
      :bulk-pick-only="true"
      triangle="top"
      class="events-list__assignees-list events-list__assignees-list--bulk"
      @hide="hideBulkAssigneesList"
      @pick-user="onBulkPickAssignee"
      @bulk-clear-assignees="onBulkClearAssigneesFromSelection"
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
import { FETCH_PROJECT_OVERVIEW, BULK_TOGGLE_EVENT_MARKS, UPDATE_EVENT_ASSIGNEE, REMOVE_EVENT_ASSIGNEE } from '../../store/modules/events/actionTypes';
import SearchField from '../forms/SearchField';
import EmptyState from '../utils/EmptyState.vue';
import UiSelect from '../utils/UiSelect.vue';
import UiButton from '../utils/UiButton.vue';
import notifier from 'codex-notifier';

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
    UiButton,
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
      /**
       * Selected list row ids (repetition / display event id from dailyEvents)
       */
      selectedRepetitionIds: [],
      bulkActionLoading: false,
      /**
       * Bulk bar assignee picker
       */
      isBulkAssigneesShowed: false,
      bulkAssigneesListPosition: {
        top: 0,
        left: 0,
      },
      bulkAssignAnchorEl: null,
      /**
       * Bound handler to detach in hideBulkAssigneesList
       */
      bulkAssignOnViewportChange: null,
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
  mounted() {
    window.addEventListener('keydown', this.onDocumentEscape);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onDocumentEscape);
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
    /**
     * Number of selected rows in bulk mode
     */
    selectedCount() {
      return this.selectedRepetitionIds.length;
    },
    /**
     * True when at least one row is selected (bulk bar + all rows show checkboxes)
     *
     * @returns {boolean}
     */
    selectionModeActive() {
      return this.selectedRepetitionIds.length > 0;
    },
    /**
     * Event row ids in list order (same as template v-for over groupedByDate)
     *
     * @returns {string[]}
     */
    flattenedDailyEventIds() {
      const flat = [];
      const grouped = this.groupedByDate;

      for (const date of Object.keys(grouped)) {
        for (const dailyEventInfo of grouped[date]) {
          flat.push(dailyEventInfo.eventId);
        }
      }

      return flat;
    },
    /**
     * Selected runs: flatten top/bottom inner radii between consecutive selected rows
     *
     * @returns {Record<string, { top: boolean; bottom: boolean }>}
     */
    bulkAdjacentByEventId() {
      const flat = this.flattenedDailyEventIds;
      const result = {};

      for (let i = 0; i < flat.length; i++) {
        const id = flat[i];

        if (!this.isRowSelected(id)) {
          continue;
        }

        result[id] = {
          top: i > 0 && this.isRowSelected(flat[i - 1]),
          bottom: i < flat.length - 1 && this.isRowSelected(flat[i + 1]),
        };
      }

      return result;
    },
  },
  methods: {
    /**
     * Clear bulk selection (hides bar when empty)
     */
    exitBulkSelect() {
      this.hideBulkAssigneesList();
      this.selectedRepetitionIds = [];
    },
    /**
     * Exit bulk selection on Escape
     *
     * @param {KeyboardEvent} e - key event
     * @returns {void}
     */
    onDocumentEscape(e) {
      if (e.key !== 'Escape' || this.selectedCount === 0) {
        return;
      }
      e.preventDefault();
      this.exitBulkSelect();
    },
    /**
     * Whether repetition row id is selected
     *
     * @param {string} repetitionId - daily event row id
     * @returns {boolean}
     */
    isRowSelected(repetitionId) {
      return this.selectedRepetitionIds.includes(repetitionId);
    },
    /**
     * Toggle row selection in bulk mode
     *
     * @param {string} repetitionId - daily event row id
     * @returns {void}
     */
    toggleRowSelected(repetitionId) {
      const ids = this.selectedRepetitionIds;
      const i = ids.indexOf(repetitionId);

      if (i >= 0) {
        ids.splice(i, 1);
      } else {
        ids.push(repetitionId);
      }
    },
    /**
     * Run bulk toggle for resolved or ignored (original event ids)
     *
     * @param {'resolved'|'ignored'} mark - mark to toggle
     * @returns {Promise<void>}
     */
    async runBulkMark(mark) {
      const originalIds = [];

      for (const rid of this.selectedRepetitionIds) {
        const ev = this.getEvent(rid);

        if (ev && ev.originalEventId) {
          originalIds.push(ev.originalEventId);
        }
      }

      const uniqueOriginal = [...new Set(originalIds)];

      if (uniqueOriginal.length === 0) {
        return;
      }

      this.bulkActionLoading = true;

      try {
        const result = await this.$store.dispatch(BULK_TOGGLE_EVENT_MARKS, {
          projectId: this.projectId,
          eventIds: uniqueOriginal,
          mark,
        });

        if (!result) {
          notifier.show({
            message: this.$t('event.bulk.markError'),
            style: 'error',
            time: 8000,
          });

          return;
        }

        if (result.failedEventIds.length > 0) {
          notifier.show({
            message: this.$t('event.bulk.markPartial', {
              updated: result.updatedCount,
              failed: result.failedEventIds.length,
            }),
            style: 'error',
            time: 10000,
          });
        }

        this.exitBulkSelect();
        this.reloadDailyEvents();
      } finally {
        this.bulkActionLoading = false;
      }
    },
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

      try {
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
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * Reset pagination and reload list
     */
    reloadDailyEvents() {
      this.dailyEventsNextCursor = null;
      this.noMore = false;
      this.dailyEvents = [];
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
      this.hideBulkAssigneesList();

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
      this.hideBulkAssigneesList();

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
    /**
     * Open workspace member picker under bulk assign button
     *
     * @param {MouseEvent} evt - click event
     * @returns {void}
     */
    onBulkAssignButtonClick(evt) {
      /* Otherwise, the same click will reach the document and v-click-outside will close the just-mounted list */

      if (evt && typeof evt.stopPropagation === 'function') {
        evt.stopPropagation();
      }

      if (this.isAssigneesShowed) {
        this.hideAssigneesList();
      }

      const el = evt && evt.currentTarget ? evt.currentTarget : null;

      if (!el) {
        return;
      }

      if (this.isBulkAssigneesShowed && this.bulkAssignAnchorEl === el) {
        this.hideBulkAssigneesList();

        return;
      }

      this.hideBulkAssigneesList();
      this.bulkAssignAnchorEl = el;
      this.isBulkAssigneesShowed = true;
      this.setBulkAssigneesPosition();
      this.bulkAssignOnViewportChange = this.setBulkAssigneesPosition.bind(this);
      window.addEventListener('resize', this.bulkAssignOnViewportChange);
      window.addEventListener('scroll', this.bulkAssignOnViewportChange, true);
    },
    /**
     * Fixed position for bulk assign popover (below trigger)
     *
     * @returns {void}
     */
    setBulkAssigneesPosition() {
      if (!this.bulkAssignAnchorEl) {
        return;
      }

      const rect = this.bulkAssignAnchorEl.getBoundingClientRect();

      this.bulkAssigneesListPosition = {
        top: `${rect.bottom + 6}px`,
        left: `${rect.left}px`,
      };
    },
    /**
     * Close bulk assignee picker and detach listeners
     *
     * @returns {void}
     */
    hideBulkAssigneesList() {
      this.isBulkAssigneesShowed = false;
      this.bulkAssignAnchorEl = null;

      if (typeof this.bulkAssignOnViewportChange === 'function') {
        window.removeEventListener('resize', this.bulkAssignOnViewportChange);
        window.removeEventListener('scroll', this.bulkAssignOnViewportChange, true);
        this.bulkAssignOnViewportChange = null;
      }
    },
    /**
     * Assign picked user to all selected rows (repetition ids)
     *
     * @param {object} user - workspace team member (same shape as in AssigneesList)
     * @returns {Promise<void>}
     */
    async onBulkPickAssignee(user) {
      this.hideBulkAssigneesList();

      if (!user || this.selectedCount === 0) {
        return;
      }

      this.bulkActionLoading = true;

      try {
        const ids = [...this.selectedRepetitionIds];

        for (const repetitionId of ids) {
          await this.$store.dispatch(UPDATE_EVENT_ASSIGNEE, {
            projectId: this.projectId,
            eventId: repetitionId,
            assignee: user,
          });
        }

        this.exitBulkSelect();
        this.reloadDailyEvents();
      } finally {
        this.bulkActionLoading = false;
      }
    },
    /**
     * Bulk: remove assignee from all selected events
     *
     * @returns {Promise<void>}
     */
    async onBulkClearAssigneesFromSelection() {
      this.hideBulkAssigneesList();

      if (this.selectedCount === 0) {
        return;
      }

      this.bulkActionLoading = true;

      try {
        for (const repetitionId of [...this.selectedRepetitionIds]) {
          await this.$store.dispatch(REMOVE_EVENT_ASSIGNEE, {
            projectId: this.projectId,
            eventId: repetitionId,
          });
        }

        this.exitBulkSelect();
        this.reloadDailyEvents();
      } finally {
        this.bulkActionLoading = false;
      }
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
  min-height: 400px;

  &__bulk-slot {
    flex-shrink: 0;
    box-sizing: border-box;
    min-height: 40px;
    margin-block: 12px 0;
  }

  &__bulk-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 16px;
    align-items: center;
    justify-content: space-between;
  }

  &__bulk-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 16px;
  }

  &__bulk-cancel-combo {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font: inherit;
    cursor: pointer;
  }

  &__bulk-cancel-esc {
    color: var(--color-text-second);
    font-size: 12px;
    font-weight: 500;
    user-select: none;
  }

  &__bulk-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  &__bulk-count {
    color: var(--color-text-main);
    font-size: 13px;
    font-weight: 500;
  }

  &__group {
    margin-top: 8px;
  }

  &__group + &__group {
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
    z-index: 200;
  }

  &__assignees-list--bulk {
    transform: none;
  }

  &__assignee-filter {
    flex-shrink: 0;
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
