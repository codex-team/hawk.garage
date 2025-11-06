<template>
  <div class="release-events">
    <EventsList
      v-if="events.length"
      :project-id="projectId"
      :is-loading="false"
      :no-more="true"
      :get-project-event-by-id="getProjectEventById"
    />
    <EmptyState
      v-else
      icon="like"
      :title="$t('projects.releases.empty.eventsTitle')"
      :description="$t('projects.releases.empty.eventsDesc')"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import EventsList from "@/components/project/EventsList.vue";
import EmptyState from "@/components/utils/EmptyState.vue";
import { mapGetters } from "vuex";
import { SET_EVENTS_FILTERS, SET_EVENTS_ORDER } from "@/store/modules/events/actionTypes";
import { DailyEvent, EventsSortOrder, HawkEvent, HawkEventDailyInfo } from "@/types/events";
import { ReleaseDetails } from '@/types/release';

export default Vue.extend({
  name: "ReleaseEvents",
  components: { EventsList, EmptyState },
  props: {
    releaseDetails: {
      type: Object as PropType<ReleaseDetails>,
      required: true,
    },
  },
  computed: {
    projectId(): string {
      return this.$route.params.projectId;
    },
    release(): string {
      return this.$route.params.release;
    },
    events(): DailyEvent[] {
      return this.releaseDetails.dailyEventsPortion.dailyEvents || [];
    },
    eventMap(): Record<string, HawkEvent> {
      const map: Record<string, HawkEvent> = {};

      this.events.forEach((dailyEvent: DailyEvent) => {
        map[dailyEvent.event.id] = dailyEvent.event
      });

      return map;
    },
    dailyEventsCompatible(): { groupingTimestamp: number; eventId: string; count: number; affectedUsers: number }[] {
      return this.events.map((dailyEvent: DailyEvent) => ({
        groupingTimestamp: dailyEvent.groupingTimestamp,
        eventId: dailyEvent.event.id,
        count: dailyEvent.count,
        affectedUsers: dailyEvent.affectedUsers,
      }));
    },

    ...mapGetters([ 'getProjectEventById' ]),
  },
  created() {
    this.$store.commit(SET_EVENTS_FILTERS, {
      projectId: this.projectId,
      filters: {},
    });
    this.$store.commit(SET_EVENTS_ORDER, {
      projectId: this.projectId,
      order: EventsSortOrder.ByDate,
    });
  },
});
</script>

<style>
.release-events {
  margin: 0 auto;
  max-width: var(--width-event-center-container);
}
</style>
