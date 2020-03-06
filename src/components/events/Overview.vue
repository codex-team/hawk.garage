<template>
  <PopupDialog
    class="event-overview"
    big
    @close="$router.push({name: 'project-overview', params: { projectId }})"
  >
    <div class="event-overview__container">
      <div class="event-overview__header">
        <h1 class="event-overview__title">
          {{ event.payload.title }}
        </h1>
        <div class="event-overview__statistics">
          <div
            class="event-overview__times"
            @click="$router.push({name: 'event-repetitions-overview', params: { projectId, eventId }})"
          >
            <div class="event-overview__statistics-count">
              {{ event.totalCount | spacedNumber }}
            </div>
            times
          </div>
          <div class="event-overview__days-repeating" style="opacity: 0.2;">
            <div class="event-overview__statistics-count">
              -
            </div>
            days repeating
          </div>
          <div class="event-overview__users-affected" style="opacity: 0.2;">
            <div class="event-overview__statistics-count">
              -
            </div>
            users affected
          </div>
        </div>
        <div class="event-overview__filename">
          <template v-if="loading">
            Loading...
          </template>
          <template v-else>
            {{ location }}
          </template>
        </div>
      </div>
      <div class="event-overview__info">
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
            v-if="getIntegrationAddons('vue')"
            class="event-overview__section"
            :addons="getIntegrationAddons('vue')"
            title="Vue"
          />
          <DetailsAddons
            v-if="addonsFiltered"
            class="event-overview__section"
            :addons="addonsFiltered"
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
import { FETCH_EVENT_REPETITION, VISIT_EVENT } from '@/store/modules/events/actionTypes';
import { HawkEvent, HawkEventBacktraceFrame } from '@/types/events';

export default Vue.extend({
  name: 'EventOverview',
  components: {
    PopupDialog,
    DetailsCookie,
    DetailsBacktrace,
    DetailsAddons,
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
     * Addons without integration
     * that will be shown as separated components
     * @return {object}
     */
    addonsFiltered(): object | null {
      if (!this.event.payload.addons) {
        return null;
      }

      const integrationToFilter = [ 'vue' ];
      const filteredAddons = {};

      Object.entries(this.event.payload.addons).forEach(([name, value]) => {
        if (!integrationToFilter.includes(name)) {
          filteredAddons[name] = value;
        }
      });

      return filteredAddons;
    },
  },
  methods: {
    /**
     * Extract integration group from the addons
     * For example, 'vue' or 'react
     * @param integrationName - name of an integration
     * @return object with integration addons
     */
    getIntegrationAddons(integrationName): object | null {
      if (!this.event.payload.addons) {
        return null;
      }

      if (!this.event.payload.addons[integrationName]) {
        return null;
      }

      return this.event.payload.addons[integrationName];
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
      width: 100%;
    }

    &__header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 40px 40px 20px 40px;
      text-align: center;
      background-color: #121419;
    }

    &__badge {
      display: inline-flex;
      height: 23px;
      margin: 0 auto;
      padding: 5px 8px 5px 10px;
      border-radius: 4px;
    }

    &__title {
      flex-basis: 100%;
      flex-grow: 1;
      max-width: 650px;
      margin: 0 auto;
      padding: 30px 0;
      font-weight: bold;
      font-size: 24px;
      line-height: 1.25;
    }

    &__statistics {
      position: relative;
      margin: 0 auto;
    }

    &__times {
      left: -60px;
      transform: translateX(-100%);
      cursor: pointer;
    }

    &__users-affected {
      right: -60px;
      transform: translateX(100%);
    }

    &__times,
    &__users-affected {
      position: absolute;
    }

    &__times,
    &__days-repeating,
    &__users-affected {
      display: inline-block;
      color: var(--color-text-second);
      font-size: 14px;
      text-align: center;
    }

    &__statistics-count {
      margin-bottom: 4px;
      font-weight: bold;
      font-size: 20px;
      font-style: normal;
      letter-spacing: -0.45px;
    }

    &__filename {
      width: 100%;
      margin-top: 30px;
      font-size: 11px;
      font-family: var(--font-monospace);
      line-height: 1.4;
      opacity: 0.3;
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
