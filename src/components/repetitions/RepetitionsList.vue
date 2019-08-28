<template>
  <PopupDialog
    class="repetitions-overview"
    @close="$router.push({name: 'project-overview', params: { projectId }})"
  >
    <div class="repetitions-overview__container">
      <!-- HEADER -->
      <div class="repetitions-overview__header">
        <!-- Header arrow icon -->
        <div class="header-arrow">
          <div class="header-arrow__icon">
            <Icon
              class="badge__icon"
              symbol="arrow-left"
            />
          </div>
        </div>

        <!-- Header error type badge -->
        <div class="header-badge">
          <Badge
            class="repetitions-overview__badge"
            with-icon
            type="critical"
            content="FATAL ERROR"
          />
        </div>

        <div class="header-title">
          {{ this.lastEvent ? this.lastEvent.payload.title : '' }}
        </div>

        <div class="header-time">today, 13:15: {{ this.lastEvent ? this.lastEvent.payload.timestamp : ''}}</div>
      </div>

      <!-- Content -->
      <div class="repetitions-overview__content">

        <div class="content-header">
          <div class="content-header__label content-header__label--total">Total</div>
          <div class="content-header__value content-header__value--repeats">{{ this.lastEvent ? this.lastEvent.count : 0}} times</div>
        </div>

        <div class="content-header">
          <div class="content-header__label content-header__label--since">Since</div>
          <div class="content-header__value content-header__value--date">12 aug 2019, 14:30: {{ this.firstEvent ? this.firstEvent.payload.timestamp : '' }} <span>— 352 days</span></div>
        </div>

        <div class="content-header">
          <div class="content-header__label content-header__label--repetitions">Repetitions</div>
        </div>

        <div class="repetitions-list">
          <div class="repetitions-list__by-date">
            <table class="event-repetitions">
              <tr class="event-repetitions__only-date">
                <td class="event-repetitions__item-date">7 may</td>
              </tr>
              <tr class="event-repetitions__item">
                <td class="event-repetitions__item-time">19:30</td>
                <td class="event-repetitions__item-user-photo">--</td>
                <td class="event-repetitions__item-user-name">Iren Adler</td>
                <td class="event-repetitions__item-user-os">Linux</td>
                <td class="event-repetitions__item-user-browser">Firefox 61.0</td>
                <td class="event-repetitions__item-user-screen">1920x946</td>
                <td class="event-repetitions__item-page">/startup/primeliber-com/blog/15598/8-instrumentov-dl…</td>
              </tr>

              <tr>
                <td>19:29</td>
                <td>--</td>
                <td>Weinstei...</td>
                <td>Windows</td>
                <td>Firefox 62.0</td>
                <td>1366x626</td>
                <td>/blogs/new/6</td>
              </tr>

              <tr>
                <td>19:28</td>
                <td>--</td>
                <td>Sam Man...</td>
                <td>Windows</td>
                <td>Firefox 62.0</td>
                <td>1366x628</td>
                <td>/blogs/new/5</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </PopupDialog>
</template>

<script>
import PopupDialog from "../utils/PopupDialog";
import Icon from "../utils/Icon";
import Badge from "../utils/Badge";

import { FETCH_EVENT_REPETITIONS } from '../../store/modules/events/actionTypes';

export default {
  name: 'RepetitionsList',
  components: {
    Icon,
    Badge,
    PopupDialog
  },
  data() {
    const projectId = this.$route.params.projectId;
    const eventId = this.$route.params.eventId;
    return {
      repetitions: [],
      loaded: false,
      projectId,
      eventId
    };
  },
  computed: {
    /**
     * @return {*}
     */
    firstEvent() {
      return this.repetitions[0];
    },

    /**
     * @return {*}
     */
    lastEvent() {
      return this.repetitions[this.repetitions.length - 1];
    }
  },
  created() {
    this.$store.dispatch(FETCH_EVENT_REPETITIONS, {
      projectId: this.projectId,
      eventId: this.eventId
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
  .repetitions-overview {
    &__container {
      flex-grow: 1;
    }

    &__header {
      display: flex;
      padding: 18px 20px;
      align-items: center;
      background-color: #000;

      & .header-time {
        margin-left: auto;
        font-weight: bold;
        font-size: 16px;
        line-height: 1.88em;
        text-align: center;
        opacity: 0.6;
      }

      & .header-arrow {
        &__icon {
          width: 13px;
          height: 13px;
        }
      }

      & .header-title {
        margin-left: 20px;
        font-weight: bold;
        font-size: 16px;
        line-height: 1.88em;
        text-align: center;
      }

      & .header-badge {
        margin-left: 15px;
      }
    }

    &__content {
      width: 80%;
      margin: auto;

      & .content-header {
        margin-top: 30px;

        &__label {
          margin-bottom: 10px;
          color: rgba(219, 230, 255, 0.6);
          font-weight: bold;
          font-size: 12px;
          letter-spacing: 0.15px;
          text-transform: uppercase;
        }

        &__value {
          &--repeats {
            color: var(--color-text-main);
            font-weight: bold;
            font-size: 24px;
          }

          &--date {
            color: var(--color-text-main);
            font-weight: bold;
            font-size: 15px;
          }
        }
      }
    }

    .repetitions-list {
      &__by-date {
        color: var(--color-text-main);
        font-size: 14px;
        opacity: 0.6;
      }
    }

    .event-repetitions {
      &__only-date {
        display: block;
        margin-top: 20px;
        margin-bottom: 18px;
      }

      &__item {
        &-date,
        &-time {
          width: 45px;
        }

        &-user-name,
        &-user-os,
        &-user-browser {
          font-weight: bold;
          font-size: 13px;
        }

        $-page {
          color: rgba(219, 230, 255, 0.6);
        }
      }
    }
  }
</style>
