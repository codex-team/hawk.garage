<template>
  <div class="release-events">
    <EventsList fallback="fancy-release" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import EventsList from '@/components/project/EventsList.vue';
import { mapGetters } from 'vuex';
import { SET_EVENTS_FILTERS, SET_EVENTS_ORDER } from '@/store/modules/events/actionTypes';
import { EventsSortOrder } from '@/types/events';
import { ReleaseDetails } from '@/types/release';

export default defineComponent({
  name: 'ReleaseEvents',
  components: { EventsList },
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
  max-width: var(--width-event-center-container);
  margin: 0 auto;
}
</style>
