<template>
  <div class="event-header">
    <div class="event-layout__container">
      <div class="event-header__error">
        <Icon
          class="event-header__flash-icon"
          symbol="flash"
        />
        <span class="event-header__error-text">
          Uncaught TypeError
        </span>
      </div>
      <h1
        class="event-header__title"
      >
        {{ (!loading) ? event.payload.title : $t('utils.loading') }}
      </h1>
      <Filepath
        class="event-header__location"
        :location="location"
        :is-highlight="true"
      />
      <div class="event-header__buttons">
        <UIButton
          class="event-overview__button"
          :class="{'event-overview__button--selected': !loading && event.marks.includes('RESOLVED')}"
          content="Resolve"
          icon="checkmark"
          @click="markEvent('RESOLVED')"
        />
        <UIButton
          class="event-overview__button"
          :class="{'event-overview__button--selected': !loading && event.marks.includes('STARRED')}"
          content="Star"
          icon="star"
          @click="markEvent('STARRED')"
        />
        <UIButton
          class="event-overview__button"
          :class="{'event-overview__button--selected': !loading && event.marks.includes('IGNORED')}"
          content="Ignore"
          icon="hided"
          @click="markEvent('IGNORED')"
        />
        <UIButton
          class="event-header__button"
          content="issue"
          icon="github"
        />
      </div>
      <div class="event-header__information">
        <EventHeaderNavigation
          :items="navigationItems"
          @tabChanged="tabChanged($event)"
        />
        <ViewedBy />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import EventHeaderNavigation from './EventHeaderNavigation.vue';
import ViewedBy from '../utils/ViewedBy.vue';
import UIButton from '../utils/UIButton.vue';
import Filepath from '../utils/Filepath.vue';
import Icon from '../utils/Icon.vue';
import { HawkEvent, HawkEventBacktraceFrame } from '@/types/events';
import { TOGGLE_EVENT_MARK } from '@/store/modules/events/actionTypes';

export default Vue.extend({
  name: 'EventHeader',
  components: {
    EventHeaderNavigation,
    ViewedBy,
    UIButton,
    Filepath,
    Icon,
  },
  props: {
    /**
     * Original (first) event data
     * @type {HawkEvent}
     */
    event: {
      type: Object as () => HawkEvent,
      default: null,
      validator: prop => typeof prop === 'object' || prop === null,
    },
  },
  data() {
    const loading = !this.event;

    return {
      /**
       * Status of repetition-diff fetching
       * @type {boolean}
       */
      loading,
    };
  },
  computed: {
    /**
     * Event location got from the first backtrace frame
     *
     * @return {string}
     */
    location(): string {
      if (!this.event) {
        return '';
      }

      const trace: HawkEventBacktraceFrame[] = this.event.payload.backtrace;

      if (!trace) {
        return '';
      }
      const firstWithFile = trace.find(frame => !!frame.file);

      if (firstWithFile) {
        return firstWithFile.file;
      }

      return '';
    },

    /**
     * Navigation items
     *
     * @return {Object[]}
     */
    navigationItems(): Object[] {
      return [ {
        title: 'overview',
        link: 'event-overview',
        badge: null,
      }, {
        title: 'repetitions',
        link: 'event-overview-repetitions',
        badge: !this.loading ? this.event.totalCount : ' ',
      }, {
        title: 'daily',
        link: 'event-overview-daily',
        badge: 0,
      } ];
    },
  },
  watch: {
    /**
     * When event is changed
     */
    event() {
      this.loading = false;
    },
  },
  methods: {
    /**
     * Emit for active item
     * @param {string} item - active item
     */
    tabChanged(item) {
      this.$emit('tabChanged', item);
    },

    /**
     * Set mark for current event
     *
     * @param {string} mark - mark to set
     */
    markEvent(mark) {
      const { projectId, eventId } = this.$route.params;

      this.$store.dispatch(TOGGLE_EVENT_MARK, {
        projectId,
        eventId,
        mark,
      });
    },
  },
});
</script>

<style>
  .event-header {
    padding: 35px 20px 0 20px;
    color: var(--color-text-main);
    background-color: #121419;

    &__error {
      display: inline-flex;
      padding: 4px 10px;
      background-color: var(--color-bg-second);
      border-radius: 4px;

      &-text {
        align-items: center;
        font-weight: 500;
        font-size: 13px;
        letter-spacing: 0.05px;
        opacity: 0.6;
      }
    }

    &__flash-icon {
      width: 7px;
      height: 12px;
      margin-right: 10px;
      opacity: 0.6;
    }

    &__title {
      font-size: 18px;
      line-height: 1.67;
    }

    &__location {
      display: block;
      margin-bottom: 30px;
      font-size: 14px;
      letter-spacing: 0.1px;
    }

    &__path {
      opacity: 0.6;
    }

    &__buttons {
      display: flex;
      margin-bottom: 13px;
    }

    &__button {
      margin-right: 5px;
      border: solid 1px var(--color-bg-main);

      &--selected {
        color: #121419;
        border-color: var(--color-text-main);
        background-color: var(--color-text-main);

        span, svg {
          opacity: 1 !important;
        }
      }
    }

    &__information {
      display: flex;
      justify-content: space-between;
      height: 50px;
    }
  }
</style>
