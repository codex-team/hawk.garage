<template>
  <div class="release-events">
    <EventItem
      v-for="event in events"
      :key="event.id"
      :event="normalizeEvent(event)"
      :last-occurrence-timestamp="event.timestamp"
      :count="event.totalCount"
      :affected-users-count="event.affectedUsers || null"
      @showEventOverview="showEventOverview(event)"
    />
    <div v-if="!events.length" class="release-events__empty">—</div>
  </div>
</template>

<script>
import EventItem from "@/components/project/EventItem.vue";

export default {
  name: "ReleaseEvents",
  components: { EventItem },
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
      console.log('events computed', this.releaseDetails);
      return this.releaseDetails.events || [];
    },
  },
  mounted() {
    console.log('Events mounted, releaseDetails:', this.releaseDetails);
  },
  methods: {
    normalizeEvent(e) {
      return {
        marks: {},
        ...e,
      };
    },
    showEventOverview(event) {
      this.$router.push({
        name: 'event-overview',
        params: {
          projectId: this.projectId,
          eventId: event.originalEventId,
          repetitionId: event.id,
        },
      });
    },
  },
};
</script>

<style>
.release-events__time {
  color: var(--color-text-second);
  font-size: 12px;
  min-width: 42px;
}
.release-events__title {
  color: var(--color-text-main);
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.release-events__empty {
  color: var(--color-text-second);
  padding: 16px 0;
}
</style>
