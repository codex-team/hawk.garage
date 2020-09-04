<template>
  <div>
    <Chart :points="chartData" />
  </div>
</template>

<script>
import Chart from '../events/Chart';
import { GET_CHART_DATA } from '../../store/modules/events/actionTypes';

export default {
  name: 'EventDaily',
  components: {
    Chart,
  },
  data() {
    return {
      /**
       * Data for a chart
       *
       * @type {EventChartItem[]}
       */
      chartData: [],
    };
  },
  computed: {
    /**
     * Returns project id from the route
     *
     * @returns {string}
     */
    projectId() {
      return this.$route.params.projectId;
    },

    /**
     * Return event id from the route
     */
    eventId() {
      return this.$route.params.eventId;
    },
  },
  /**
   * Vue created hook
   * Used to fetch events on component creation
   */
  async created() {
    const twoWeeks = 34;
    const boundingDays = 2;

    if (!this.$store.getters.getProjectEventById(this.projectId, this.eventId).chartData) {
      await this.$store.dispatch(GET_CHART_DATA, {
        projectId: this.projectId,
        eventId: this.eventId,
        days: twoWeeks + boundingDays,
      });
    }

    this.chartData = this.$store.getters.getProjectEventById(this.projectId, this.eventId).chartData;
  },
};
</script>
