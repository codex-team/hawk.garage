<template>
  <PopupDialog
    class="event-layout"
    big
    @close="$router.push({name: 'project-overview', params: { projectId }})"
  >
    <EventHeader
      v-if="event || loading"
      :event="event"
      @tabChanged="tabChanged($event)"
    />
    <div class="event-layout__info">
      <div class="event-layout__container">
        <router-view
          v-if="event"
          :event="event"
          :project-id="projectId"
          :is-loading="loading"
        />
        <div
          v-else-if="loading"
          class="event-layout__loader"
        />
        <div
          v-else
          class="empty-event"
        >
          {{ $t('event.notFound' ) }}
        </div>
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
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'EventLayout',
  components: {
    PopupDialog,
    EventHeader,
  },
  data() {
    return {
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
    ...mapGetters({
      getEvent: 'getProjectEventRepetition',
    }),
    /**
     * Current viewed event
     */
    event(): HawkEvent {
      const { repetitionId, eventId, projectId } = this.$route.params;

      return this.getEvent(projectId, eventId, repetitionId);
    },
  },
  /**
   * Vue created hook. Fetches error's data
   *
   * @returns {Promise<void>}
   */
  async created() {
    try {
      const eventId = this.$route.params.eventId;
      const repetitionId = this.$route.params.repetitionId;

      await this.$store.dispatch(FETCH_EVENT_REPETITION, {
        projectId: this.projectId,
        eventId,
        repetitionId,
      });

      this.loading = false;

      /**
       * It can be empty event if it was archived
       */
      if (this.event) {
        this.markEventAsVisited();
      }
    } catch (error) {
      console.error(error);

      this.$sendToHawk(`Error on Event page creation!: ${(error as Error).message}`);

      this.$notify.open({
        description: 'Error fetching event',
      });
    } finally {
      this.loading = false;
    }

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
  @import "./../../styles/variables.css";
  @import "./../../styles/custom-properties.css";

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

  .empty-event {
    @apply --empty-placeholder;
  }
</style>
