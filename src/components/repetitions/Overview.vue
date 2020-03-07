<template>
  <PopupDialog
    class="repetitions-overview"
    big
    @close="$router.push({name: 'event-overview', params: { projectId: projectId, eventId: eventId }})"
  >
    <div class="repetitions-overview__container">
      <!-- HEADER -->
      <div class="repetitions-overview__header">
        <!-- Header arrow icon -->
        <div
          class="repetitions-overview__header-arrow"
          @click="$router.push({name: 'event-overview', params: { projectId: projectId, eventId: eventId }})"
        >
          <Icon
            class="badge__icon repetitions-overview__header-arrow-icon"
            symbol="arrow-left"
          />
        </div>

        <div
          v-if="event && event.payload"
          class="repetitions-overview__header-title"
        >
          {{ event.payload.title }}
        </div>
        <div
          v-if="event && event.payload"
          class="repetitions-overview__header-time"
        >
          {{ event.payload.timestamp | prettyDate }}, {{ event.payload.timestamp | prettyTime }}
        </div>
      </div>

      <!-- Content -->
      <div class="repetitions-overview__content">
        <div class="repetitions-overview__section">
          <div class="repetitions-overview__label">
            Total
          </div>
          <div
            v-if="event"
            class="repetitions-overview__repeats"
          >
            {{ event.totalCount }} times
          </div>
        </div>

        <div class="repetitions-overview__section">
          <div class="repetitions-overview__label">
            Since
          </div>
          <div
            v-if="event"
            class="repetitions-overview__since"
          >
            {{ event.payload.timestamp | prettyDate }}, {{ event.payload.timestamp | prettyTime }} <span class="repetitions-overview__since-days">— {{ since }}</span>
          </div>
        </div>

        <div class="repetitions-overview__section">
          <div class="repetitions-overview__label">
            Repetitions
          </div>

          <div
            v-for="date in groupedRepetitions.keys()"
            :key="date"
            class="repetitions-overview__table"
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
    </div>
  </PopupDialog>
</template>

<script>
import PopupDialog from '../utils/PopupDialog';
import Icon from '../utils/Icon';
import { FETCH_EVENT_REPETITION, FETCH_EVENT_REPETITIONS } from '../../store/modules/events/actionTypes';
import i18n from './../../i18n';
import RepetitionsList from './RepetitionsList';

export default {
  name: 'RepetitionsOverview',
  components: {
    RepetitionsList,
    Icon,
    PopupDialog,
  },
  data: function () {
    return {
      event: null,
      groupedRepetitions: new Map(),
    };
  },
  computed: {
    eventId() {
      return this.$route.params.eventId;
    },
    projectId() {
      return this.$route.params.projectId;
    },
    since() {
      const now = new Date();
      const firstOccurrence = new Date(this.event.payload.timestamp);
      const differenceInDays = (now - firstOccurrence) / (1000 * 3600 * 24);

      return `${Math.round(differenceInDays)} days`;
    },
  },
  async created() {
    this.event = this.$store.getters.getProjectEventById(this.projectId, this.eventId);

    if (!this.event || this.event.payload) {
      this.event = await this.$store.dispatch(FETCH_EVENT_REPETITION, {
        projectId: this.projectId,
        eventId: this.eventId,
      });
    }

    /**
     * Dispatching action that fetches several latest repetitions
     */
    const repetitions = await this.$store.dispatch(FETCH_EVENT_REPETITIONS, {
      projectId: this.projectId,
      eventId: this.eventId,
      limit: 10,
    });

    /**
     * We use Map here to save the key's order,
     * `Object` does not guarantee the iteration order
     * @type {Map<String, HawkEventRepetition[]>}
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
     * @param {String} timestamp
     *
     * @return {string}
     */
    getDate(timestamp) {
      const targetDate = new Date(timestamp);
      const day = targetDate.getDate();
      const month = targetDate.getMonth();

      return `${day} ${i18n.t('common.months[' + month + ']')}`;
    },
  },
};
</script>

<style>
  .repetitions-overview {
    &__container {
      flex-grow: 1;
    }

    &__header {
      display: flex;
      align-items: center;
      padding: 18px 20px;
      font-size: 16px;
      background-color: #000;

      &-arrow {
        cursor: pointer;

        &-icon {
          width: 13px;
          height: 13px;
        }
      }

      &-badge {
        margin-left: 15px;
      }

      &-title {
        margin-left: 20px;
        font-weight: bold;
        line-height: 1.88em;
        text-align: center;
      }

      &-time {
        margin-left: auto;
        font-weight: bold;
        line-height: 1.88em;
        text-align: center;
        opacity: 0.6;
      }
    }

    &__content {
      width: 80%;
      margin: auto;
    }

    &__section {
      margin-top: 30px;
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
    &__since {
      color: var(--color-text-main);
      font-weight: bold;
      font-size: 15px;

      &-days {
        color: var(--color-text-second);
      }
    }

    &__table {
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }
</style>
