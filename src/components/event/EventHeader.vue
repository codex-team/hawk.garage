<template>
  <div class="event-header">
    <div class="event-layout__container">
      <UiLabel
        :text="!loading ? event.payload.type || 'Application error' : $t('event.loading')"
        icon="flash"
      />
      <span class="event-header__date">
        {{ event.payload.timestamp | prettyFullDate }}
      </span>
      <h1 class="event-header__title">
        {{ (!loading) ? event.payload.title : $t('event.loading') }}
      </h1>
      <Filepath
        class="event-header__location"
        :location="location"
        :is-highlight="true"
        :title="location"
      />
      <div class="event-header__buttons">
        <UiButton
          class="event-header__button"
          :class="{'event-header__button--selected': !loading && event.marks.resolved}"
          :content="$t('event.resolve')"
          icon="checkmark"
          small
          @click="markEvent('resolved')"
        />
        <UiButton
          class="event-header__button"
          :class="{'event-header__button--selected': !loading && event.marks.starred}"
          :content="$t('event.star')"
          icon="star"
          small
          @click="markEvent('starred')"
        />
        <UiButton
          class="event-header__button"
          :class="{'event-header__button--selected': !loading && event.marks.ignored}"
          :content="$t('event.ignore')"
          icon="hided"
          small
          @click="markEvent('ignored')"
        />
        <UiButton
          class="event-header__button"
          :content="$t('event.issue')"
          icon="github"
          small
        />
      </div>
      <div class="event-header__nav-bar">
        <TabBar
          :items="navigationItems"
          :active-item-index="currentNavigationItem"
        />
        <div class="event-header__viewed-by">
          <ViewedBy
            v-if="event && event.visitedBy && event.visitedBy.length"
            :users="event.visitedBy"
          />
          <AssigneeBar
            :event="event"
            :project-id="projectId"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TabBar, { TabInfo } from '../utils/TabBar.vue';
import ViewedBy from '../utils/ViewedBy.vue';
import UiButton from '../utils/UiButton.vue';
import Filepath from '../utils/Filepath.vue';
import UiLabel from '../utils/UiLabel.vue';
import AssigneeBar from '../utils/AssigneeBar.vue';

import { HawkEvent, HawkEventBacktraceFrame } from '@/types/events';
import { TOGGLE_EVENT_MARK } from '@/store/modules/events/actionTypes';

export default Vue.extend({
  name: 'EventHeader',
  components: {
    TabBar,
    ViewedBy,
    UiButton,
    UiLabel,
    Filepath,
    AssigneeBar,
  },
  props: {
    /**
     * Original (first) event data
     */
    event: {
      type: Object as () => HawkEvent,
      default: null,
      validator: prop => typeof prop === 'object' || prop === null,
    },
  },
  data() {
    return {
      /**
       * Status of repetition-diff fetching
       *
       * @type {boolean}
       */
      loading: !this.event,
    };
  },
  computed: {
    /**
     * Event location got from the first backtrace frame
     * Or got from a url if the backtrace is empty
     *
     * @returns {string}
     */
    location(): string {
      if (!this.event) {
        return '';
      }

      const trace: HawkEventBacktraceFrame[] = this.event.payload.backtrace;
      const addons: {url?: string} = this.event.payload.addons;
      const url: string = (addons && addons.url) || '';

      if (!trace) {
        return url;
      }
      const firstWithFile = trace.find(frame => !!frame.file);

      if (firstWithFile) {
        return firstWithFile.file;
      }

      return url;
    },

    /**
     * Navigation items
     *
     * @returns {TabInfo[]}
     */
    navigationItems(): TabInfo[] {
      const showAffectedUsers = !this.loading && this.event.usersAffected;

      return [
        {
          title: this.$i18n.t('event.navigation.overview') as string,
          routeName: 'event-overview',
        },
        {
          title: this.$i18n.t('event.navigation.repetitions') as string,
          routeName: 'event-repetitions',
          badge: !this.loading ? this.event.totalCount : 0,
        },
        {
          title: this.$i18n.t('event.navigation.daily') as string,
          routeName: 'event-daily',
        },
        ...(showAffectedUsers ? [ {
          title: this.$i18n.t('event.navigation.usersAffected') as string,
          routeName: 'event-affected',
          badge: this.event.usersAffected,
        } ] : []),
      ];
    },

    /**
     * Return index of current page from this.navigationItems
     */
    currentNavigationItem(): number {
      return this.navigationItems.findIndex(({ routeName }) => {
        return routeName === this.$route.name;
      });
    },

    /**
     * Returns project id from the route
     */
    projectId(): string {
      return this.$route.params.projectId;
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

    &__title {
      margin: 10px 0 15px;
      font-size: 18px;
      line-height: 1.67;
    }

    &__date {
      float: right;
      color: var(--color-text-second);
      font-size: 12px;
      line-height: 23px;
    }

    &__location {
      display: block;
      max-width: 650px;
      margin-bottom: 30px;
      overflow: hidden;
      color: var(--color-text-second);
      font-size: 14px;
      letter-spacing: 0.1px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__buttons {
      display: flex;
      margin-bottom: 13px;
    }

    &__button {
      margin-right: 5px;
      border: solid 1px var(--color-bg-main);

      &--selected {
        color: var(--color-bg-main);
        background-color: var(--color-text-main);
        border-color: var(--color-text-main);

        &:not(&--disabled):hover {
          color: var(--color-bg-main);
          background-color: var(--color-bg-button-hover);
        }

        span, svg {
          opacity: 1 !important;
        }
      }

      &:hover {
        color: var(--color-text-main)
      }
    }

    &__nav-bar, &__viewed-by {
      display: flex;
      justify-content: space-between;
      height: 50px;
    }
  }
</style>
