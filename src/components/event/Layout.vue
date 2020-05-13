<template>
  <PopupDialog
    class="event-layout"
    big
    @close="$router.push({name: 'project-overview', params: { projectId }})"
  >
    <EventHeader
      :event="event"
      @tabChanged="tabChanged($event)"
    />
    <div class="event-layout__info">
      <div class="event-layout__container">
        <router-view
          v-if="event"
          :event="event"
          :project-id="projectId"
        />
        <div
          v-else
          class="event-layout__loader"
        />
      </div>
    </div>
  </PopupDialog>
</template>

<script lang="ts">
import Vue from 'vue';
import PopupDialog from '../utils/PopupDialog.vue';
import EventHeader from './EventHeader.vue';
import { HawkEvent } from '@/types/events';
import { FETCH_EVENT_REPETITION, VISIT_EVENT } from '@/store/modules/events/actionTypes';

export default Vue.extend({
  name: 'EventLayout',
  components: {
    PopupDialog,
    EventHeader,
  },
  data() {
    return {
      /**
       * Original (first) event data
       *
       * @type {HawkEvent}
       */
      repetitionId: this.$route.params.repetitionId,

      /**
       * Current project id
       *
       * @type {string}
       */
      projectId: this.$route.params.projectId,

      /**
       * Current event id
       *
       * @type {string}
       */
      eventId: this.$route.params.eventId,

      /**
       * Status of repetition-diff fetching
       *
       * @type {boolean}
       */
      loading: true,

      /**
       * Active menu item
       *
       * @type {string}
       */
      activeItem: 'overview',
    };
  },

  computed: {
    event() {
      return this.$store.getters.getProjectEventRepetition(this.projectId, this.eventId, this.repetitionId);
    },
  },

  /**
   * Vue created hook. Fetches error's data
   *
   * @returns {Promise<void>}
   */
  async created() {
    const eventId = this.$route.params.eventId;
    const repetitionId = this.$route.params.repetitionId;

    await this.$store.dispatch(FETCH_EVENT_REPETITION, {
      projectId: this.projectId,
      eventId,
      repetitionId,
    });

    /**
     * If page opened directly, this.event is null, so we need to set observer from VueX
     */
    // if (!this.event) {
    //   this.event = this.$store.getters.getProjectEventRepetition(this.projectId, eventId, repetitionId);
    // }

    this.loading = false;

    this.markEventAsVisited();
  },

  methods: {
    /**
     * Set current event as visited for current user
     */
    markEventAsVisited() {
      const userId = this.$store.state.user.data.id;

      /**
       * Dispatch VISIT_EVENT action on component create
       */
      if (!this.event.visitedBy || !this.event.visitedBy.find(user => user.id === userId)) {
        this.$store.dispatch(VISIT_EVENT, {
          projectId: this.projectId,
          eventId: this.eventId,
        });
      }
    },
  },
});
</script>

<style>
  @import "./../../styles/variables";

  .event-layout {
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
      max-width: var(--width-event-center-container);
      margin: 0 auto;
    }

    &__info {
      padding: 25px 30px;
    }

    &__loader {
      min-height: 200px;
      margin: -25px 0;

      @mixin loader 34px, var(--color-border), var(--color-text-second);
    }
  }
</style>
