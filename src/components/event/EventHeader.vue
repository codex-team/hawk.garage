<template>
  <div class="event-header">
    <div class="event-layout__container">
      <span
        v-if="!loading"
        class="event-header__date"
      >
        {{ formattedFullDate }}
      </span>

      <div
        v-if="workspace"
        class="event-header__breadcrumbs"
      >
        <router-link
          class="event-header__breadcrumbs-item"
          :to="'/workspace/' + workspace.id"
        >
          <EntityImage
            :id="workspace.id"
            :image="workspace.image"
            :name="workspace.name"
            size="16"
          />
          {{ workspace.name }}
        </router-link>
        <router-link
          class="event-header__breadcrumbs-item"
          :to="'/project/' + project.id"
        >
          <EntityImage
            :id="project.id"
            :image="project.image"
            :name="project.name"
            size="16"
          />
          {{ nameWithoutBadges(project.name) }}

          <ProjectBadge
            v-for="(badge, index) in projectBadges(project.name)"
            :key="index"
          >
            {{ badge }}
          </ProjectBadge>
        </router-link>
      </div>

      <div class="event-header__type">
        {{ !loading ? event.payload.type || 'Application error' : $t('event.loading') }}
      </div>

      <h1 class="event-header__title">
        {{ trimmedTitle }}
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
          v-if="!loading && event.taskManagerItem"
          class="event-header__button"
          :content="`Issue #${event.taskManagerItem.number}`"
          icon="github"
          small
          @click="openIssueUrl"
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
            v-if="!loading"
            :event="event"
            :project-id="projectId"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { prettyFullDate, trimString } from '@/utils/filters';
import TabBar, { TabInfo } from '../utils/TabBar.vue';
import ViewedBy from '../utils/ViewedBy.vue';
import UiButton from '../utils/UiButton.vue';
import Filepath from '../utils/Filepath.vue';
import AssigneeBar from '../utils/AssigneeBar.vue';
import EntityImage from '../utils/EntityImage.vue';

import { HawkEvent, HawkEventBacktraceFrame } from '@/types/events';
import { TOGGLE_EVENT_MARK } from '@/store/modules/events/actionTypes';
import { Project } from '@/types/project';
import { Workspace } from '@/types/workspaces';
import { projectBadges } from '../../mixins/projectBadges';
import ProjectBadge from '../project/ProjectBadge.vue';
import { JavaScriptAddons } from '@hawk.so/types';

export default defineComponent({
  name: 'EventHeader',
  components: {
    TabBar,
    ViewedBy,
    UiButton,
    Filepath,
    AssigneeBar,
    EntityImage,
    ProjectBadge,
  },
  mixins: [projectBadges],
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
      const addons: { url?: string } = this.event.payload.addons as JavaScriptAddons;
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
          title: this.$t('event.navigation.overview') as string,
          routeName: 'event-overview',
        },
        {
          title: this.$t('event.navigation.repetitions') as string,
          routeName: 'event-repetitions',
          badge: !this.loading ? this.event.totalCount : 0,
        },
        {
          title: this.$t('event.navigation.daily') as string,
          routeName: 'event-daily',
        },
        ...(showAffectedUsers
          ? [{
              title: this.$t('event.navigation.usersAffected') as string,
              routeName: 'event-affected',
              badge: this.event.usersAffected,
            }]
          : []),
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

    /**
     * The project that owns the event
     */
    project(): Project {
      return this.$store.getters.getProjectById(this.projectId);
    },

    /**
     * The workspace that owns the event
     */
    workspace(): Workspace {
      return this.$store.getters.getWorkspaceByProjectId(this.projectId);
    },

    /**
     * Computed property that returns formatted full date for event timestamp
     */
    formattedFullDate(): string {
      return prettyFullDate(this.event.timestamp);
    },

    /**
     * Computed property that returns trimmed title or loading text
     */
    trimmedTitle(): string {
      const text = !this.loading ? this.event.payload.title : this.$t('event.loading');

      return trimString(text, 300);
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

    /**
     * Open GitHub issue URL in new tab
     */
    openIssueUrl() {
      if (this.event && this.event.taskManagerItem && this.event.taskManagerItem.url) {
        window.open(this.event.taskManagerItem.url, '_blank', 'noopener');
      }
    },
  },
});
</script>

<style>
  .event-header {
    padding: 35px 20px 0 20px;
    color: var(--color-text-second);
    font-size: 14px;
    background-color: #121419;

    &__breadcrumbs {
      display: flex;
      margin-bottom: 22px;
      font-weight: 500;

      &-item {
        display: flex;
        align-items: center;

        &:not(:last-of-type){

          &::after {
            margin: 0 10px;
            content: '/';
          }
        }

        .entity-image {
          margin-right: 10px;
        }
      }
    }

    &__type {
      font-weight: 500;
      font-size: 12.2px;
      font-family: var(--font-monospace);
      letter-spacing: 0.21px;
    }

    &__title {
      margin: 10px 0 15px;
      overflow: hidden;
      color: var(--color-text-main);
      font-size: 18px;
      line-height: 1.67;
      text-overflow: ellipsis;
    }

    &__date {
      float: right;
      font-size: 12px;
      line-height: 23px;
    }

    &__location {
      display: block;
      max-width: 650px;
      margin-bottom: 30px;
      overflow: hidden;
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
    }
  }
</style>
