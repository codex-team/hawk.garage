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

        <!-- Header error type badge -->
        <Badge
          class="repetitions-overview__header-badge"
          with-icon
          type="critical"
          content="FATAL ERROR"
        />

        <div
          v-if="actualEvent.payload"
          class="repetitions-overview__header-title"
        >
          {{ actualEvent.payload.title }}
        </div>

        <div
          v-if="actualEvent.payload"
          class="repetitions-overview__header-time"
        >
          {{ actualEvent.payload.timestamp | prettyDate }}, {{ actualEvent.payload.timestamp | prettyTime }}
        </div>
      </div>

      <!-- Content -->
      <div class="repetitions-overview__content">
        <div class="repetitions-overview__section">
          <div class="repetitions-overview__label">
            Total
          </div>
          <div class="repetitions-overview__repeats">
            {{ actualEvent.totalCount }} times
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
import Badge from '../utils/Badge';
import { GET_LATEST_EVENT, FETCH_EVENT_REPETITIONS } from '../../store/modules/events/actionTypes';
import i18n from './../../i18n';
import RepetitionsList from './RepetitionsList';

export default {
  name: 'RepetitionsOverview',
  components: {
    RepetitionsList,
    Icon,
    Badge,
    PopupDialog
  },
  data() {
    const projectId = this.$route.params.projectId;
    const eventId = this.$route.params.eventId;

    return {
      projectId,
      eventId,
      actualEvent: {},
      groupedRepetitions: []
    };
  },
  computed: {
    /**
     * @return {GroupedEvent}
     */
    event() {
      return this.$store.getters.getProjectEventById(this.projectId, this.eventId);
    },

    since() {
      const now = new Date();
      const firstOccurence = new Date(this.event.payload.timestamp);
      const differenceInDays = (now - firstOccurence) / (1000 * 3600 * 24);

      return `${Math.round(differenceInDays)} days`;
    }
  },
  async created() {
    /**
     * actual event is original event merged with latest repetitions
     *
     * For that we use GET_LATEST_EVENT action that merges event from store with repetition
     * @type {GroupedEvent}
     */
    this.actualEvent = await this.$store.dispatch(GET_LATEST_EVENT, {
      projectId: this.projectId,
      eventId: this.eventId
    });

    /**
     * Dispatching action that fetches several latest repetitions
     * @type {GroupedEvent[]}
     */
    const repetitions = await this.$store.dispatch(FETCH_EVENT_REPETITIONS, {
      projectId: this.projectId,
      eventId: this.eventId
    });

    console.log('repetitions', repetitions);

    /**
     * We use Map here to save the key's order,
     * `Object` does not guarantee the iteration order
     * @type {Map<String, GroupedEvent[]>}
     */
    const groupedRepetitions = new Map();

    /**
     * Grouping repetitions by date
     */
    repetitions.map((repetition) => {
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
    }
  }
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
