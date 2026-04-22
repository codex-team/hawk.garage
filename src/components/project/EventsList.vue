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
      <BulkActionsBar
        :selection-mode-active="selectionModeActive"
        :selected-count="selectedCount"
        :on-bulk-mark="runBulkMark"
        :bulk-resolve-label="bulkResolveLabel"
        :bulk-resolve-icon="bulkResolveIcon"
        :bulk-ignore-label="bulkIgnoreLabel"
        :bulk-ignore-icon="bulkIgnoreIcon"
        :bulk-star-label="bulkStarLabel"
        :bulk-star-icon="bulkStarIcon"
        @exit-bulk-select="exitBulkSelect"
        @bulk-assign-click="onBulkAssignButtonClick"
        @bulk-more-menu-click="onBulkMoreMenuButtonClick"
      />
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
          v-for="dailyEventInfo in eventsByDate"
          :key="dailyEventInfo.eventId"
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
          @toggle-row-select="toggleRowSelected(dailyEventInfo.eventId, $event)"
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
    <div
      v-if="isBulkMoreMenuShowed"
      v-click-outside="hideBulkMoreMenu"
      :style="bulkMoreMenuPosition"
      class="events-list__bulk-more-menu"
    >
      <UiContextList :items="bulkMoreMenuItems" />
    </div>
  </div>
</template>

<script>
import EventItem from './EventItem';
import EventItemSkeleton from './EventItemSkeleton';
import BulkActionsBar from './BulkActionsBar.vue';
import { groupByGroupingTimestamp, debounce, getPlatform } from '@/utils';
import { prettyDate } from '@/utils/filters';
import AssigneesList from '../event/AssigneesList';
import { mapGetters } from 'vuex';
import { FETCH_PROJECT_OVERVIEW, BULK_TOGGLE_EVENT_MARKS, BULK_UPDATE_EVENT_ASSIGNEE, VISIT_EVENT } from '../../store/modules/events/actionTypes';
import SearchField from '../forms/SearchField';
import EmptyState from '../utils/EmptyState.vue';
import UiSelect from '../utils/UiSelect.vue';
import UiContextList from '../utils/UiContextList.vue';
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
    BulkActionsBar,
    AssigneesList,
    SearchField,
    EmptyState,
    UiSelect,
    UiContextList,
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
      /**
       * Last toggled row id used as Shift-selection anchor
       */
      lastSelectedRepetitionId: null,
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
      /**
       * Bulk "more actions" menu
       */
      isBulkMoreMenuShowed: false,
      bulkMoreMenuPosition: {
        top: 0,
        left: 0,
      },
      bulkMoreMenuAnchorEl: null,
      bulkMoreMenuOnViewportChange: null,
    };
  },
  created() {
    this.loadMoreEvents(true);
    this.bulkActionInFlight = false;

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
    this.hideAssigneesList();
    this.hideBulkAssigneesList();
    this.hideBulkMoreMenu();
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
     * Selected events resolved from current row ids
     *
     * @returns {object[]}
     */
    selectedEvents() {
      return this.selectedRepetitionIds
        .map(repetitionId => this.getEvent(repetitionId))
        .filter(Boolean);
    },
    /**
     * True when all selected events are ignored
     *
     * @returns {boolean}
     */
    areAllSelectedIgnored() {
      return this.selectedEvents.length > 0 && this.selectedEvents.every(event => event.marks?.ignored);
    },
    /**
     * True when all selected events are resolved
     *
     * @returns {boolean}
     */
    areAllSelectedResolved() {
      return this.selectedEvents.length > 0 && this.selectedEvents.every(event => event.marks?.resolved);
    },
    /**
     * True when all selected events are starred
     *
     * @returns {boolean}
     */
    areAllSelectedStarred() {
      return this.selectedEvents.length > 0 && this.selectedEvents.every(event => event.marks?.starred);
    },
    /**
     * Dynamic bulk label for ignore action
     *
     * @returns {string}
     */
    bulkIgnoreLabel() {
      return this.areAllSelectedIgnored
        ? this.$t('event.bulk.unignore')
        : this.$t('event.ignore');
    },
    /**
     * Dynamic bulk label for resolve action
     *
     * @returns {string}
     */
    bulkResolveLabel() {
      return this.areAllSelectedResolved
        ? this.$t('event.bulk.unresolve')
        : this.$t('event.resolve');
    },
    /**
     * Dynamic bulk icon for resolve action
     *
     * @returns {string}
     */
    bulkResolveIcon() {
      return this.areAllSelectedResolved ? 'close-circle' : 'checkmark';
    },
    /**
     * Dynamic bulk label for starred action
     *
     * @returns {string}
     */
    bulkStarLabel() {
      return this.areAllSelectedStarred
        ? this.$t('event.bulk.unstar')
        : this.$t('event.star');
    },
    /**
     * Dynamic bulk icon for ignore action
     *
     * @returns {string}
     */
    bulkIgnoreIcon() {
      return this.areAllSelectedIgnored ? 'eye' : 'hided';
    },
    /**
     * Dynamic bulk icon for starred action
     *
     * @returns {string}
     */
    bulkStarIcon() {
      return this.areAllSelectedStarred ? 'star-outline' : 'star';
    },
    /**
     * "More actions" menu items for bulk toolbar
     *
     * @returns {Array}
     */
    bulkMoreMenuItems() {
      return [
        {
          label: this.$t('event.bulk.markViewed'),
          icon: 'eye',
          isActive: false,
          onActivate: () => {
            void this.onBulkMarkViewed();
          },
        },
      ];
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
      this.hideBulkMoreMenu();
      this.selectedRepetitionIds = [];
      this.lastSelectedRepetitionId = null;
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
     * Toggle row selection in bulk mode, supports Shift range selection
     *
     * @param {string} repetitionId - daily event row id
     * @param {MouseEvent} [evt] - click event (for Shift key state)
     * @returns {void}
     */
    toggleRowSelected(repetitionId, evt) {
      const flat = this.flattenedDailyEventIds;
      const isShiftRange = !!(
        evt
        && evt.shiftKey
        && this.lastSelectedRepetitionId
        && this.lastSelectedRepetitionId !== repetitionId
      );

      if (isShiftRange) {
        const fromIndex = flat.indexOf(this.lastSelectedRepetitionId);
        const toIndex = flat.indexOf(repetitionId);

        if (fromIndex >= 0 && toIndex >= 0) {
          const start = Math.min(fromIndex, toIndex);
          const end = Math.max(fromIndex, toIndex);
          const selectedSet = new Set(this.selectedRepetitionIds);

          for (let i = start; i <= end; i++) {
            selectedSet.add(flat[i]);
          }

          this.selectedRepetitionIds = flat.filter(id => selectedSet.has(id));
          this.lastSelectedRepetitionId = repetitionId;

          return;
        }
      }

      const ids = this.selectedRepetitionIds;
      const i = ids.indexOf(repetitionId);

      if (i >= 0) {
        ids.splice(i, 1);
      } else {
        ids.push(repetitionId);
      }

      this.lastSelectedRepetitionId = repetitionId;

      if (ids.length === 0) {
        this.lastSelectedRepetitionId = null;
      }
    },
    /**
     * Run bulk toggle for marks
     *
     * @param {'resolved'|'ignored'|'starred'} mark - mark to toggle
     * @returns {Promise<void>}
     */
    async runBulkMark(mark) {
      if (this.bulkActionInFlight) {
        return;
      }

      const uniqueOriginal = this.getSelectedOriginalIds();

      if (uniqueOriginal.length === 0) {
        return;
      }

      this.bulkActionInFlight = true;

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
      } finally {
        this.bulkActionInFlight = false;
      }
    },
    /**
     * Selected original event ids from current selection
     *
     * @returns {string[]}
     */
    getSelectedOriginalIds() {
      const originalIds = [];

      for (const repetitionId of this.selectedRepetitionIds) {
        const event = this.getEvent(repetitionId);

        if (event && event.originalEventId) {
          originalIds.push(String(event.originalEventId));
        }
      }

      return [...new Set(originalIds)];
    },
    /**
     * Keep only selected rows that are currently rendered
     *
     * @returns {void}
     */
    syncSelectionWithVisibleRows() {
      if (this.selectedRepetitionIds.length === 0) {
        return;
      }

      const visibleSet = new Set(this.flattenedDailyEventIds);
      const nextSelected = this.selectedRepetitionIds.filter(id => visibleSet.has(id));

      if (nextSelected.length === this.selectedRepetitionIds.length) {
        return;
      }

      this.selectedRepetitionIds = nextSelected;
      this.lastSelectedRepetitionId = nextSelected.length > 0 ? nextSelected[nextSelected.length - 1] : null;

      if (nextSelected.length === 0) {
        this.exitBulkSelect();
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

        this.syncSelectionWithVisibleRows();
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * Reset pagination and reload list
     */
    reloadDailyEvents() {
      this.exitBulkSelect();
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
      this.hideBulkMoreMenu();

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
      this.hideBulkMoreMenu();

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
      if (this.bulkActionInFlight) {
        return;
      }

      /* Otherwise, the same click will reach the document and v-click-outside will close the just-mounted list */

      if (evt && typeof evt.stopPropagation === 'function') {
        evt.stopPropagation();
      }

      if (this.isAssigneesShowed) {
        this.hideAssigneesList();
      }
      this.hideBulkMoreMenu();

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
     * Toggle bulk "more actions" menu
     *
     * @param {MouseEvent} evt - click event
     * @returns {void}
     */
    onBulkMoreMenuButtonClick(evt) {
      if (this.bulkActionInFlight) {
        return;
      }

      if (evt && typeof evt.stopPropagation === 'function') {
        evt.stopPropagation();
      }

      this.hideBulkAssigneesList();
      if (this.isAssigneesShowed) {
        this.hideAssigneesList();
      }

      const el = evt && evt.currentTarget ? evt.currentTarget : null;

      if (!el) {
        return;
      }

      if (this.isBulkMoreMenuShowed && this.bulkMoreMenuAnchorEl === el) {
        this.hideBulkMoreMenu();

        return;
      }

      this.hideBulkMoreMenu();
      this.bulkMoreMenuAnchorEl = el;
      this.isBulkMoreMenuShowed = true;
      this.setBulkMoreMenuPosition();
      this.bulkMoreMenuOnViewportChange = this.setBulkMoreMenuPosition.bind(this);
      window.addEventListener('resize', this.bulkMoreMenuOnViewportChange);
      window.addEventListener('scroll', this.bulkMoreMenuOnViewportChange, true);
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
      const LIST_WIDTH = 210;
      const ARROW_X_FROM_LEFT = 174; // AssigneesList top triangle: right: 36px => 210 - 36
      const OFFSET_X = 8;
      const viewportWidth = window.innerWidth;
      const leftPadding = 8;
      const anchorX = rect.left + rect.width / 2;
      const desiredLeft = anchorX - ARROW_X_FROM_LEFT + OFFSET_X;
      const clampedLeft = Math.min(
        Math.max(desiredLeft, leftPadding),
        Math.max(leftPadding, viewportWidth - LIST_WIDTH - leftPadding)
      );

      this.bulkAssigneesListPosition = {
        top: `${rect.bottom + 8}px`,
        left: `${clampedLeft}px`,
      };
    },
    /**
     * Position bulk "more actions" menu near trigger
     *
     * @returns {void}
     */
    setBulkMoreMenuPosition() {
      if (!this.bulkMoreMenuAnchorEl) {
        return;
      }

      const rect = this.bulkMoreMenuAnchorEl.getBoundingClientRect();
      const OFFSET_X = 0;
      const MENU_WIDTH = 260;
      const viewportWidth = window.innerWidth;
      const leftPadding = 8;
      const desiredRight = rect.right + OFFSET_X;
      const clampedRight = Math.min(
        Math.max(desiredRight, MENU_WIDTH + leftPadding),
        Math.max(MENU_WIDTH + leftPadding, viewportWidth - leftPadding)
      );

      this.bulkMoreMenuPosition = {
        top: `${rect.bottom + 8}px`,
        left: `${clampedRight}px`,
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
     * Close bulk "more actions" menu and detach listeners
     *
     * @returns {void}
     */
    hideBulkMoreMenu() {
      this.isBulkMoreMenuShowed = false;
      this.bulkMoreMenuAnchorEl = null;

      if (typeof this.bulkMoreMenuOnViewportChange === 'function') {
        window.removeEventListener('resize', this.bulkMoreMenuOnViewportChange);
        window.removeEventListener('scroll', this.bulkMoreMenuOnViewportChange, true);
        this.bulkMoreMenuOnViewportChange = null;
      }
    },
    /**
     * Assign picked user to all selected rows (repetition ids)
     *
     * @param {object} user - workspace team member (same shape as in AssigneesList)
     * @returns {Promise<void>}
     */
    async onBulkPickAssignee(user) {
      if (this.bulkActionInFlight) {
        return;
      }

      this.hideBulkAssigneesList();

      if (!user || this.selectedCount === 0) {
        return;
      }

      this.bulkActionInFlight = true;

      try {
        const originalIds = this.getSelectedOriginalIds();
        await this.$store.dispatch(BULK_UPDATE_EVENT_ASSIGNEE, {
          projectId: this.projectId,
          eventIds: originalIds,
          assignee: user,
        });
      } finally {
        this.bulkActionInFlight = false;
      }
    },
    /**
     * Bulk: remove assignee from all selected events
     *
     * @returns {Promise<void>}
     */
    async onBulkClearAssigneesFromSelection() {
      if (this.bulkActionInFlight) {
        return;
      }

      this.hideBulkAssigneesList();

      if (this.selectedCount === 0) {
        return;
      }

      this.bulkActionInFlight = true;

      try {
        const originalIds = this.getSelectedOriginalIds();
        await this.$store.dispatch(BULK_UPDATE_EVENT_ASSIGNEE, {
          projectId: this.projectId,
          eventIds: originalIds,
          assignee: null,
        });
      } finally {
        this.bulkActionInFlight = false;
      }
    },
    /**
     * Bulk: mark selected events as viewed (badge should become visited)
     *
     * @returns {Promise<void>}
     */
    async onBulkMarkViewed() {
      if (this.bulkActionInFlight) {
        return;
      }

      this.hideBulkAssigneesList();
      this.hideBulkMoreMenu();

      if (this.selectedCount === 0) {
        return;
      }

      this.bulkActionInFlight = true;

      try {
        const originalIds = this.getSelectedOriginalIds();

        await Promise.all(originalIds.map(originalEventId => this.$store.dispatch(VISIT_EVENT, {
          projectId: this.projectId,
          originalEventId,
        })));
      } finally {
        this.bulkActionInFlight = false;
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
    margin-block: 18px 0;
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
    margin-left: 11px;
  }

  &__bulk-cancel-combo {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font: inherit;
    white-space: nowrap;
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

  &__bulk-action-button,
  &__bulk-action-button .ui-button-text,
  &__bulk-action-button .ui-button-icon {
    white-space: nowrap;
  }

  &__bulk-action-button .ui-button-icon-assignee {
    width: 16px;
    height: 16px;
  }

  &__bulk-more-trigger.ui-button {
    padding-inline: 8px;
    background-color: transparent;
    border: 0;
  }

  &__bulk-count {
    color: var(--color-text-main);
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
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

  &__bulk-more-menu {
    position: fixed;
    z-index: 210;
    transform: translateX(-100%);

    .ui-context-list {
      background-color: var(--color-bg-main);
      border: 1px solid var(--color-border);
      box-shadow: 0 11px 13px -4px rgba(0, 0, 0, 0.5);
    }
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
    padding-inline: 11px;
  }
}
</style>
