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
          <div class="header-arrow">
            <Icon
              class="badge__icon header-arrow__icon"
              symbol="arrow-left"
            />
          </div>
        </div>

        <!-- Header error type badge -->
        <Badge
          class="repetitions-overview__header-badge"
          with-icon
          type="critical"
          content="FATAL ERROR"
        />

        <div class="repetitions-overview__header-title">
          {{ event.payload.title }}
        </div>

        <div class="repetitions-overview__header-time">
          {{ event.payload.timestamp | prettyDate }}, {{ event.payload.timestamp | prettyTime }}
        </div>
      </div>

      <!-- Content -->
      <div class="repetitions-overview__content">
        <div class="repetitions-overview__section event-info">
          <div class="event-info__label">
            Total
          </div>
          <div class="event-info__repeats">
            {{ event.count }} times
          </div>
        </div>

        <div class="repetitions-overview__section event-info">
          <div class="event-info__label">
            Since
          </div>
          <div class="event-info__since">
            {{ event.firstOccurence | prettySince }}
          </div>
        </div>

        <div class="repetitions-overview__section event-info">
          <div class="event-info__label">
            Repetitions
          </div>
          <div class="event-info__repetitions">
            <RepetitionsList />
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
import RepetitionsList from './RepetitionsList';

export default {
  name: 'RepetitionsOverview',
  components: {
    Icon,
    Badge,
    PopupDialog,
    RepetitionsList
  },
  data() {
    const projectId = this.$route.params.projectId;
    const eventId = this.$route.params.eventId;

    return {
      projectId,
      eventId
    };
  },
  computed: {
    /**
     * @return {Event}
     */
    event() {
      return this.$store.getters.getProjectEventById(this.projectId, this.eventId);
    }
  }
};
</script>

<style>
  .header-arrow {
    &__icon {
      width: 13px;
      height: 13px;
    }
  }

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
  }

  .event-info {
    &__label {
      margin-bottom: 10px;
      color: rgba(219, 230, 255, 0.6);
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
    }

    &__repetitions {
      margin-top: 20px;
    }
  }
</style>
