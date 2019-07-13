<template>
  <PopupDialog>

  </PopupDialog>
</template>

<script>
import PopupDialog from '../utils/PopupDialog';

export default {
  name: 'EventOverview',
  data() {
    const projectId = this.$route.params.projectId;
    const eventId = this.$route.params.eventId;
    const event = this.$store.getters.project(projectId).events.find(ev => ev.id === eventId);

    return {
      event,
      projectId
    };
  },
  components: {
    PopupDialog
  }
};
</script>

<style>

</style>
