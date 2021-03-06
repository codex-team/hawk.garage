<template>
  <div class="event-repetitions">
    <div class="event-repetitions__section">
      <div class="event-repetitions__label">
        {{ $t('event.repetitions.total') }}
      </div>
      <div
        v-if="event"
        class="event-repetitions__repeats"
      >
        {{ $tc('event.repetitions.times', event.totalCount) }}
      </div>
    </div>

    <div class="event-repetitions__section">
      <div class="event-repetitions__label">
        {{ $t('event.repetitions.title') }}
      </div>

      <div
        v-for="date in groupedRepetitions.keys()"
        :key="date"
        class="event-repetitions__table"
      >
        <RepetitionsList
          :repetitions="groupedRepetitions.get(date)"
          :event="event"
          :project-id="projectId"
          :date="date"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { FETCH_EVENT_REPETITIONS } from '@/store/modules/events/actionTypes';
import i18n from './../../i18n';
import RepetitionsList from './RepetitionsList.vue';
import { HawkEvent } from '@/types/events';

export default Vue.extend({
  name: 'RepetitionsOverview',
  components: {
    RepetitionsList,
  },
  props: {
    /**
     * Viewed event
     */
    event: {
      type: Object as () => HawkEvent,
      required: true,
    },

    /**
     * Project what owns event
     */
    projectId: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      groupedRepetitions: new Map(),
    };
  },
  computed: {
    originalEvent(): HawkEvent {
      return this.$store.getters.getProjectEventById(this.projectId, this.event.id);
    },
  },
  async created(): Promise<void> {
    /**
     * Dispatching action that fetches several latest repetitions
     */
    const repetitions = await this.$store.dispatch(FETCH_EVENT_REPETITIONS, {
      projectId: this.projectId,
      eventId: this.event.id,
      limit: 50,
    });

    /**
     * We use Map here to save the key's order,
     * `Object` does not guarantee the iteration order
     *
     * @type {Map<string, HawkEventRepetition[]>}
     */
    const groupedRepetitions = new Map();

    repetitions.map(repetition => {
      const date = this.getDate(repetition.payload.timestamp);

      if (!groupedRepetitions.get(date)) {
        groupedRepetitions.set(date, []);
      }

      groupedRepetitions.get(date).push(repetition);
    });

    this.groupedRepetitions = groupedRepetitions;
  },
  methods: {
    /**
     * Returns prettified date from timestamp
     *
     * @param {number} timestamp - unixtime in seconds
     * @returns {string}
     */
    getDate(timestamp: number): string {
      const targetDate = new Date(timestamp * 1000);
      const day = targetDate.getDate();
      const month = targetDate.getMonth();

      return `${day} ${i18n.t('common.months[' + month + ']')}`;
    },
  },
});
</script>

<style>
  .event-repetitions {
    &__section {
      margin-bottom: 30px;
    }

    &__label {
      margin-bottom: 10px;
      color: var(--color-text-second);
      font-weight: bold;
      font-size: 12px;
      letter-spacing: 0.15px;
      text-transform: uppercase;
    }

    &__repeats {
      color: var(--color-text-main);
      font-weight: bold;
      font-size: 24px;
    }

    &__table {
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }
</style>
