<template>
  <div class="event-repetitions">
    <div
      v-infinite-scroll="loadMoreRepetitions"
      infinite-scroll-distance="300"
      class="event-repetitions__section"
    >
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

      <p
        v-if="repetitionsLoading"
      >
        {{ $t("common.loading") }}
      </p>
      <div
        v-else
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

      <div
        v-if="repetitions.length && !noMoreRepetitions"
        class="event-repetitions__load-more"
        :class="{'loader': isLoadingRepetitions}"
        @click="loadMoreRepetitions"
      >
        <span v-if="!isLoadingRepetitions">{{ $t('projects.loadMoreEvents') }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { FETCH_EVENT_REPETITIONS } from '@/store/modules/events/actionTypes';
import i18n from './../../i18n';
import RepetitionsList from './RepetitionsList.vue';
import {HawkEvent, HawkEventRepetition} from '@/types/events';
import {mapGetters} from 'vuex';

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

      /**
       * Flag that all event repetitions are fetched
       */
      noMoreRepetitions: false,
      /**
       * Flag shows that repetitions are currently being fetched
       */
      isLoadingRepetitions: false
    };
  },
  computed: {
    ...mapGetters({
      repetitions: 'getProjectEventRepetitions',
    }),
    originalEvent(): HawkEvent {
      return this.$store.getters.getProjectEventById(this.projectId, this.event.id);
    },
    groupedRepetitions() {
      /**
       * We use Map here to save the key's order,
       * `Object` does not guarantee the iteration order
       *
       * @type {Map<string, HawkEventRepetition[]>}
       */
      const groupedRepetitions = new Map();

      this.repetitions(this.projectId, this.event.id).forEach(repetition => {
        const date = this.getDate(repetition.payload.timestamp);

        if (!groupedRepetitions.get(date)) {
          groupedRepetitions.set(date, []);
        }

        groupedRepetitions.get(date).push(repetition);
      });


      return groupedRepetitions;
    }
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

    /**
     * Loads 20 more repetitions
     */
    async loadMoreRepetitions() {
      if (this.noMoreRepetitions || this.isLoadingRepetitions) {
        return;
      }

      this.isLoadingRepetitions = true;

      const REPETITIONS_LIMIT = 20;

      const newRepetitions = await this.$store.dispatch(FETCH_EVENT_REPETITIONS, {
        projectId: this.projectId,
        eventId: this.event.id,
        limit: REPETITIONS_LIMIT
      });

      this.noMoreRepetitions = newRepetitions.length < REPETITIONS_LIMIT;

      this.isLoadingRepetitions = false;
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
  }
</style>
