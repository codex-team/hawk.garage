<template>
  <PopupDialog
    class="event-overview"
    big
    @close="$router.push({name: 'project-overview', params: { projectId }})"
  >
    <EventHeader
      :event="event"
      @toggleItem="toggleItem($event)"
    />
    <div
      class="event-overview__info"
    >
      <div class="event-overview__container">
        <EventOverview
          v-if="activeItem === 'overview'"
          :event="event"
        />
        <EventRepetitions
          v-else-if="activeItem === 'repetitions'"
        />
        <EventDaily
          v-else-if="activeItem === 'daily'"
        />
      </div>
    </div>
  </PopupDialog>
</template>

<script lang="ts">
import Vue from 'vue';
import PopupDialog from '../utils/PopupDialog.vue';
import EventHeader from './EventHeader.vue';
import EventOverview from './EventOverview.vue';
import EventRepetitions from './EventRepetitions.vue';
import EventDaily from './EventDaily.vue';
import { HawkEvent } from '@/types/events';
import { FETCH_EVENT_REPETITION, VISIT_EVENT } from '@/store/modules/events/actionTypes';

export default Vue.extend({
  name: 'EventLayout',
  components: {
    PopupDialog,
    EventHeader,
    EventOverview,
    EventRepetitions,
    EventDaily,
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

      /**
       * Active menu item
       * @type {string}
       */
      activeItem: '',
    };
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
  methods: {
    /**
     * Emit for active item
     * @param {string} item - active item
     */
    toggleItem(item: string) {
      this.activeItem! = item;
    },
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

    &__info {
      padding: 18px 30px 30px 30px;
    }
  }
</style>
