<template>
  <div class="release-events">
    <EventsList
      :events="dailyEventsCompatible"
      :project-id="projectId"
      :is-loading="false"
      :no-more="true"
      :get-project-event-by-id="getProjectEventByIdCompat"
      @showEventOverview="showEventOverviewPayload($event)"
    />
  </div>
</template>

<script>
import EventsList from "@/components/project/EventsList.vue";

export default {
  name: "ReleaseEvents",
  components: { EventsList },
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
      return this.releaseDetails.events || [];
    },
    eventMap() {
      const map = {};
      this.events.forEach(event => { map[event.id] = { marks: {}, ...event }; });
      return map;
    },
    dailyEventsCompatible() {
      return this.events.map(event => ({
        groupingTimestamp: this.getUtcMidnightSeconds(event.timestamp),
        eventId: event.id,
        count: event.totalCount,
        affectedUsers: (event.affectedUsers != null ? event.affectedUsers : event.usersAffected) ?? null,
        groupHash: event.id,
      }));
    },
  },
  methods: {
    getProjectEventByIdCompat(projectId, eventId) {
      return this.eventMap[eventId];
    },
    /**
     * Return UTC midnight in seconds from timestamp that may be ms or s
     */
    getUtcMidnightSeconds(ts) {
      const ms = ts < 1e12 ? ts * 1000 : ts;
      const d = new Date(ms);
      const utcMs = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
      return Math.floor(utcMs / 1000);
    },
    showEventOverviewPayload(payload) {
      this.$router.push({
        name: 'event-overview',
        params: {
          projectId: payload.projectId,
          eventId: payload.originalEventId,
          repetitionId: payload.eventId,
        },
      });
    },
  },
};
</script>

<style>

</style>
