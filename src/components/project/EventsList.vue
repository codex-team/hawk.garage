<template>
  <div class="events-list">
    <template v-if="hasItems">
      <div
        v-for="(eventsByDate, date) in groupedByDate"
        :key="date"
        class="events-list__group"
      >
        <div class="events-list__date">
          {{ getDay(date) | prettyDate }}
        </div>
        <EventItem
          v-for="(dailyEventInfo, index) in eventsByDate"
          :key="`${dailyEventInfo.groupHash}-${date}-${index}`"
          :last-occurrence-timestamp="getEvent(dailyEventInfo.eventId).timestamp"
          :count="dailyEventInfo.count"
          :affected-users-count="dailyEventInfo.affectedUsers"
          class="events-list__event"
          :event="getEvent(dailyEventInfo.eventId)"
          @onAssigneeIconClick="onAssigneeIconClick(dailyEventInfo.eventId, $event)"
          @showEventOverview="onShowEventOverview(dailyEventInfo.eventId)"
        />
      </div>
      <div
        v-if="!noMore && !isLoading"
        class="events-list__load-more"
        @click="$emit('loadMore')"
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
      <div class="events-list__divider" />
      {{ $t('projects.noEventsPlaceholder') }}
    </div>
  </div>
</template>

<script>
import EventItem from './EventItem';
import EventItemSkeleton from './EventItemSkeleton';
import { groupByGroupingTimestamp } from '@/utils';

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
  },
  props: {
    /**
     * Raw (not grouped) daily events array
     *
     * @type {Array}
     */
    events: {
      type: Array,
      required: true,
    },
    /**
     * Current project id
     *
     * @type {string}
     */
    projectId: {
      type: String,
      required: true,
    },
    /**
     * Loading state flag
     *
     * @type {boolean}
     */
    isLoading: {
      type: Boolean,
      default: false,
    },
    /**
     * No more data to load flag
     *
     * @type {boolean}
     */
    noMore: {
      type: Boolean,
      default: false,
    },
    /**
     * Function to obtain full event by id
     * Signature: (projectId: string, eventId: string) => GroupedEvent
     *
     * @type {Function}
     */
    getProjectEventById: {
      type: Function,
      required: true,
    },
  },
  computed: {
    /**
     * Whether there are items to display
     *
     * @returns {boolean}
     */
    hasItems() {
      return Array.isArray(this.events) && this.events.length > 0;
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

      return groupByGroupingTimestamp(this.events);
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
     * Handle assignee icon/avatar click and emit payload to parent
     *
     * @param {string} eventId
     * @param {MouseEvent} nativeEvent
     * @returns {void}
     */
    onAssigneeIconClick(eventId, nativeEvent) {
      this.$emit('assigneeIconClick', { projectId: this.projectId,
        eventId,
        nativeEvent });
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

      this.$emit('showEventOverview', { projectId: this.projectId,
        eventId,
        originalEventId });
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
}
</style>


