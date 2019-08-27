<template>
  <div>
    <EventItem
      v-for="event in repetitions"
      :key="event.id"
      class="project-overview__event"
      :event="event"
      @click.native="$router.push({name: 'event-overview', params: { projectId: event.id, eventId: event.id }})"
    />
  <div v-if="!loaded">Loading...</div>
  </div>
</template>

<script>
import EventItem from '../events/EventItem';
import { FETCH_EVENT_REPETITIONS } from '../../store/modules/events/actionTypes';

export default {
  name: 'RepetitionsList',
  components: {
    EventItem
  },
  data() {
    return {
      repetitions: [],
      loaded: false
    };
  },
  created() {
    this.$store.dispatch(FETCH_EVENT_REPETITIONS, {
      projectId: this.$route.params.projectId,
      eventId: this.$route.params.eventId
    })
      .then((repetitions) => {
        console.log('repetitions', repetitions);
        this.repetitions = repetitions;
        this.loaded = true;
      });
  }
};
</script>

<style scoped>

</style>
