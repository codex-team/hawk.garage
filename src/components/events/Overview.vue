<template>
  <PopupDialog
    class="event-overview"
    big
    @close="$router.push({name: 'project-overview', params: { projectId }})"
  >
    <div class="event-overview__header">
      <div class="event-overview__container">
        <div class="event-overview__error">
          <Icon
            class="event-overview__flash__icon"
            symbol="flash"
          />
          <span class="event-overview__error-text">
            Uncaught TypeError
          </span>
        </div>
        <h1 class="event-overview__title">
          {{ event.payload.title }}
        </h1>
        <div class="event-overview__location">
          <span class="event-overview__path">{{ path | prettyPath }}</span>
          <span class="event-overview__filename"> {{ file }} </span>
        </div>
        <div class="event-overview__github">
          <div class="event-overview__github-link">
            <Icon
              class="event-overview__github__icon-check-mark"
              symbol="check-mark"
            />
            <span class="event-overview__github-text">Resolve</span>
          </div>
          <div class="event-overview__github-link">
            <Icon
              class="event-overview__github__icon-star"
              symbol="star-inactive"
            />
            <span class="event-overview__github-text">Star</span>
          </div>
          <div class="event-overview__github-link">
            <Icon
              class="event-overview__github__icon event-overview__github__icon-hided"
              symbol="hided"
            />
            <span class="event-overview__github-text">Ignore</span>
          </div>
          <div class="event-overview__github-link">
            <Icon
              class="event-overview__github__icon-shape"
              symbol="shape"
            />
            <span class="event-overview__github-text">Create issue</span>
          </div>
        </div>
        <div class="event-overview__information">
          <div class="event-overview__statistics">
            <span class="event-overview__overview-text">
              Overview
            </span>
            <span
              class="event-overview__repetitions-text"
              @click="$router.push({name: 'event-repetitions-overview', params: { projectId, eventId }})"
            >
              Repetitions
            </span>
            <Badge
              class="event-overview__statistics-count"
              type="visited"
              :content="event.totalCount"
            />
            <span class="event-overview__days-repeating">
              Days repeating
            </span>
            <Badge
              class="event-overview__statistics-count"
              type="visited"
              content="15"
            />
          </div>
          <div class="event-overview__users">
            <Icon
              class="event-overview__eye-icon"
              symbol="eye"
            />
            <div class="event-overview__users-avatar" />
            <div class="event-overview__users-avatar" />
            <div class="event-overview__users-avatar" />
            <span class="event-overview__users-count">+17</span>
            <span class="event-overview__assignee-text">Assignee</span>
            <div class="event-overview__assignee-icons-bg">
              <div class="event-overview__assignee-icon-bg">
                <Icon
                  class="event-overview__assignee-icon"
                  symbol="assignee"
                />
              </div>
              <Icon
                class="event-overview__assignee-arrow-down"
                symbol="arrow-down"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="event-overview__info">
      <div class="event-overview__container">
        <template
          v-if="!loading"
        >
          <DetailsBacktrace
            v-if="event.payload.backtrace && event.payload.backtrace.length"
            class="event-overview__section"
            :backtrace="event.payload.backtrace"
            :lang="lang"
          />
          <DetailsCookie
            v-if="event.payload.cookies && event.payload.cookies.length"
            class="event-overview__section"
            :cookies="event.payload.cookies"
          />
          <DetailsAddons
            v-if="event.payload.addons"
            class="event-overview__section"
            :addons="event.payload.addons"
          />
        </template>
        <div
          v-else
          class="event-overview__loading"
        >
          <span>Loading...</span>
        </div>
      </div>
    </div>
  </PopupDialog>
</template>

<script lang="ts">
import Vue from 'vue';
import PopupDialog from '../utils/PopupDialog.vue';
import DetailsCookie from './DetailsCookie.vue';
import DetailsBacktrace from './DetailsBacktrace.vue';
import DetailsAddons from './DetailsAddons.vue';
import Badge from '../utils/Badge.vue';
import Icon from '../utils/Icon.vue';
import { FETCH_EVENT_REPETITION, VISIT_EVENT } from '@/store/modules/events/actionTypes';
import { HawkEvent, HawkEventBacktraceFrame } from '@/types/events';

export default Vue.extend({
  name: 'EventOverview',
  components: {
    PopupDialog,
    DetailsCookie,
    DetailsBacktrace,
    DetailsAddons,
    Badge,
    Icon,
  },
  data() {
    const projectId: string = this.$route.params.projectId;
    const eventId: string = this.$route.params.eventId;
    const event: HawkEvent = this.$store.getters.getProjectEventById(projectId, eventId);

    return {
      /**
       * Original (first) event data
       * @type {HawkEvent}
       */
      event,

      /**
       * Current project id
       * @type {string}
       */
      projectId,

      /**
       * Current event id
       * @type {string}
       */
      eventId,

      /**
       * Status of repetition-diff fetching
       * @type {boolean}
       */
      loading: true,
    };
  },
  computed: {
    /**
     * Get calling env language based on event.catcherType
     * errors/javascript -> javascript
     *
     * @return {string}
     */
    lang(): string {
      return this.event.catcherType.split('/').pop()!;
    },

    /**
     * Event location got from the first backtrace frame
     *
     * @return {string}
     */
    location(): string {
      const trace: HawkEventBacktraceFrame[] = this.event.payload.backtrace;
      const unknownLocation = 'Unknown location';

      if (!trace) {
        return unknownLocation;
      }
      const firstWithFile = trace.find(frame => !!frame.file);

      if (firstWithFile) {
        return firstWithFile.file;
      }

      return unknownLocation;
    },

    /**
     * Event path got from the first backtrace frame
     *
     * @return {string}
     */
    path(): string {
      return this.location !== 'Unknown location' ? this.location.split('/').slice(0, -1)
        .join('/') + '/' : this.location;
    },

    /**
     * Event file got from the first backtrace frame
     *
     * @return {string}
     */
    file(): string {
      return this.location !== 'Unknown location' ? this.location.split('/').slice(-1)[0] : '';
    },
  },
  /**
   * Vue created hook. Fetches error's data
   * @return {Promise<void>}
   */
  async created() {
    const eventId = this.$route.params.eventId;
    const repetitionId = this.$route.params.repetitionId;

    this.event = await this.$store.dispatch(FETCH_EVENT_REPETITION, {
      projectId: this.projectId,
      eventId,
      repetitionId,
    });
    this.loading = false;

    const userId = this.$store.state.user.data.id;

    /**
       * Dispatch VISIT_EVENT action on component create
       */
    if (!this.event.visitedBy || !this.event.visitedBy.includes(userId)) {
      this.$store.dispatch(VISIT_EVENT, {
        projectId: this.projectId,
        eventId,
      });
    }
  },
});
</script>

<style>
  .event-overview {

    /** Override Popup Dialog animation */
    &.popup-dialog-animation {
      &-enter-active {
        transition: all 100ms ease;
      }

      &-enter {
        transform: scale(1.02);
        opacity: 1;
      }

      &-enter-to {
        transform: none;
      }

      &-leave-active {
        transition: none;
      }
    }

    &__container {
      max-width: 850px;
      margin: 0 auto;
    }

    &__header {
      padding: 35px 20px 0 20px;
      background-color: #121419;
      color: var(--color-text-main);
    }

    &__error {
      display: inline-flex;
      background-color: var(--color-bg-second);
      padding: 4px 10px;
      border-radius: 4px;
    }

    &__error-text {
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.05px;
      align-items: center;
      opacity: 0.6;
    }

    &__flash__icon {
      margin-right: 10px;
      opacity: 0.6;
      width: 7px;
      height: 12px;
    }

    &__title {
      font-size: 18px;
      line-height: 1.67;
    }

    &__location {
      margin-bottom: 30px;
      font-size: 14px;
      letter-spacing: 0.1px;
    }

    &__path {
      opacity: 0.6;
    }

    &__filename {
      color: var(--color-indicator-critical);
    }

    &__github {
      display: flex;
      margin-bottom: 13px;

      &-link {
        margin-right: 5px;
        display: flex;
        padding: 6px 7px;
        align-items: center;
        border-radius: 4px;
        border: solid 1px var(--color-bg-main);
      }

      &-text {
        font-size: 14px;
        font-weight: 500;
        opacity: 0.6;
      }

      &__icon-check-mark {
        width: 14px;
        height: 14px;
        margin-right: 8px;
      }

      &__icon-star {
        width: 14px;
        height: 14px;
        margin-right: 8px;
        opacity: 0.6;
      }

      &__icon-hided {
        width: 15px;
        height: 12px;
        margin: 2px 4px 0 1px;
        opacity: 0.6;
      }

      &__icon-shape {
        width: 14px;
        height: 14px;
        margin-right: 8px;
        opacity: 0.6;
      }
    }

    &__information {
      display: flex;
      justify-content: space-between;
      height: 50px;
    }

    &__statistics {
      display: flex;
      align-items: center;
      font-size: 14.6px;
      letter-spacing: 0.37px;
      font-weight: 500;

      &-count {
        margin-right: 30px;
        padding: 4px 8px;
        font-size: 12.6px;
        font-weight: bold;
        letter-spacing: 0.32px;
        opacity: 0.6;
        color: var(--color-text-main);
      }
    }

    &__overview-text {
      position: relative;
      opacity: 1;
      margin-right: 30px;

      &::before {
        content: '';
        position: absolute;
        bottom: -17px;
        width: 100%;
        height: 3px;
        border-radius: 1.5px;
        background-color: var(--color-indicator-medium);
      }
    }

    &__repetitions-text {
      cursor: pointer;
      margin-right: 10px;
      opacity: 0.6;
    }

    &__days-repeating {
      margin-right: 10px;
      opacity: 0.6;
    }

    &__users {
      display: flex;
      align-items: center;
      font-weight: 500;

      &-avatar {
        width: 14px;
        height: 14px;
        border-radius: 5px;
        background-color: grey;
        margin-right: 6px;
      }

      &-count {
        margin-right: 30px;
        font-size: 12px;
        opacity: 0.6;
      }
    }

    &__eye-icon {
      width: 12px;
      height: 8px;
      margin-right: 6px;
      opacity: 0.6;
    }

    &__assignee {

      &-icons-bg {
        display: flex;
        align-items: center;
        padding: 4px 9px 4px 4px;
        border-radius: 7px;
        background-color: var(--color-bg-main);
      }

      &-icon-bg {
        width: 16px;
        height: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        margin-right: 5px;
        background-color: var(--color-bg-second);
      }

      &-text {
        font-size: 14px;
        margin-right: 10px;
        opacity: 0.6;
      }

      &-icon {
        width: 14px;
        height: 14px;
        opacity: 0.6;
      }

      &-arrow-down {
        width: 12px;
        height: 12px;
        opacity: 0.6;
      }
    }

    &__info {
      padding: 30px 20px;
    }

    &__section {
      margin-bottom: 30px;
    }

    &__loading {
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
