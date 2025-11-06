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
import EventsList from "@/components/project/EventsList.vue";
import EmptyState from "@/components/utils/EmptyState.vue";
import { mapGetters } from "vuex";
import { SET_EVENTS_FILTERS, SET_EVENTS_ORDER } from "@/store/modules/events/actionTypes";
import { EventsSortOrder } from "@/types/events";

export default {
  name: "ReleaseEvents",
  components: { EventsList, EmptyState },
  props: {
    releaseDetails: {
      type: Object,
      required: true,
    },
  },
  computed: {
    projectId() {
      return this.$route.params.projectId;
    },
    release() {
      return this.$route.params.release;
    },
    events() {
      return this.releaseDetails.dailyEventsPortion.dailyEvents || [];
    },
    eventMap() {
      const map = {};

      this.events.forEach(dailyEvent => { map[dailyEvent.event.id] = dailyEvent.event });

      return map;
    },
    dailyEventsCompatible() {
      return this.events.map(dailyEvent => ({
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
  methods: {
    /**
     * Return UTC midnight in seconds from timestamp that may be ms or s
     */
    getUtcMidnightSeconds(ts) {
      const ms = ts < 1e12 ? ts * 1000 : ts;
      const d = new Date(ms);
      const utcMs = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
      return Math.floor(utcMs / 1000);
    },
  },
};
</script>

<style>
.release-events {
  margin: 0 auto;
  max-width: var(--width-event-center-container);
}
</style>
