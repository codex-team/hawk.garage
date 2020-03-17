<template>
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
      <h1
        class="event-overview__title"
      >
        {{ (!loading) ? event.payload.title : $t('utils.loading') }}
      </h1>
      <Filepath
        class="event-overview__location"
        :location="location"
        :is-highlight="true"
      />
      <div class="event-overview__buttons">
        <UIButton
          class="event-overview__button"
          content="resolve"
          icon="check-mark"
        />
        <UIButton
          class="event-overview__button"
          content="star"
          icon="star-inactive"
        />
        <UIButton
          class="event-overview__button"
          content="ignore"
          icon="hided"
        />
        <UIButton
          class="event-overview__button"
          content="issue"
          icon="shape"
        />
      </div>
      <div class="event-overview__information">
        <EventHeaderNavigation
          :event="event"
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
import Filepath from "../utils/Filepath.vue";
import Icon from '../utils/Icon.vue';
import { HawkEvent, HawkEventBacktraceFrame } from '@/types/events';

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
  },
});
</script>

<style>
  .event-overview {

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
    }

    &__information {
      display: flex;
      justify-content: space-between;
      height: 50px;
    }
  }
</style>
