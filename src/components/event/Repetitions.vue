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
        {{ $t('event.repetitions.times', { n: event.totalCount }) }}
      </div>
    </div>

    <div class="event-repetitions__section">
      <div class="event-repetitions__label">
        {{ $t('event.repetitions.title') }}
      </div>

      <p
        v-if="repetitionsLoadingFirstly"
      >
        {{ $t("common.loading") }}
      </p>
      <template v-else>
        <div
          v-for="date in groupedRepetitions.keys()"
          :key="date"
          class="event-repetitions__table"
        >
          <div class="event-repetitions__table-day">
            {{ date }}
          </div>
          <RepetitionsList
            :repetitions="groupedRepetitions.get(date)"
            :event="event"
            :project-id="projectId"
            :date="date"
          />
        </div>
      </template>

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
import { defineComponent } from 'vue';
import { FETCH_EVENT_REPETITIONS } from '@/store/modules/events/actionTypes';
import { i18n } from './../../i18n';
import RepetitionsList from './RepetitionsList.vue';
import { HawkEvent } from '@/types/events';

export default defineComponent({
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
      isLoadingRepetitions: false,

      /**
       * Flag determines if repetitions are loading
       */
      repetitionsLoadingFirstly: true,

      /**
       * Repetitions
       */
      repetitions: [] as HawkEvent[],

      /**
       * Next cursor for pagination
       */
      nextCursor: null as string | null,
    };
  },
  computed: {
    groupedRepetitions() {
      /**
       * We use Map here to save the key's order,
       * `Object` does not guarantee the iteration order
       *
       * @type {Map<string, HawkEventRepetition[]>}
       */
      const groupedRepetitions = new Map();

      this.repetitions.forEach(repetition => {
        const date = this.getDate(repetition.timestamp);

        if (!groupedRepetitions.get(date)) {
          groupedRepetitions.set(date, []);
        }

        groupedRepetitions.get(date).push(repetition);
      });

      return groupedRepetitions;
    },
  },
  mounted() {
    this.loadMoreRepetitions();
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

      return `${day} ${i18n.global.t('common.months[' + month + ']')}`;
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

      const { repetitions: newRepetitions, nextCursor } = await this.$store.dispatch(FETCH_EVENT_REPETITIONS, {
        projectId: this.projectId,
        originalEventId: this.event.originalEventId,
        limit: REPETITIONS_LIMIT,
        cursor: this.nextCursor,
      });

      this.noMoreRepetitions = !nextCursor;
      this.nextCursor = nextCursor;
      this.repetitions = [...this.repetitions, ...newRepetitions];

      this.isLoadingRepetitions = false;
      this.repetitionsLoadingFirstly = false;
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
      margin-top: 30px;
      margin-bottom: 60px;

      &-day {
        margin-bottom: 10px;
        color: var(--color-text-second);
        font-weight: 500;
        font-size: 16px;
      }
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
