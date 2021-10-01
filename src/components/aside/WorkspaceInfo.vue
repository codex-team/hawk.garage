<template>
  <div class="workspace-info">
    <EntityImage
      :id="workspace.id"
      class="workspace-info__image"
      :name="workspace.name"
      :image="workspace.image"
      size="36"
    />
    <div class="workspace-info__wrapper">
      <div class="workspace-info__name">
        {{ workspace.name }}
      </div>
      <router-link
        class="workspace-info__settings-link"
        :to="{
          name: 'workspace-settings',
          params: { workspaceId: workspace.id },
        }"
      >
        {{ $t("workspaces.settings.label") }}
      </router-link>
    </div>
    <div
      class="workspace-info__event-indicator"
      @mouseover="eventsIndicatorMouseover"
      @mouseleave="eventsIndicatorMouseleave"
    >
      <router-link
        v-if="isAdmin"
        :to="{
          name: 'workspace-settings-billing',
          params: { workspaceId: workspace.id },
        }"
      >
        <CircleProgress
          :current="eventsCount"
          :max="plan.eventsLimit || 0"
        />
      </router-link>
    </div>
    <Icon
      v-if="isAdmin"
      class="workspace-info__project-creation-button"
      symbol="plus"
      @click.native="createProjectButtonClicked"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '../utils/Icon.vue';
import EntityImage from '../utils/EntityImage.vue';
import { SET_MODAL_DIALOG } from '@/store/modules/modalDialog/actionTypes';
import { Plan } from '../../types/plan';
import CircleProgress from '../utils/CircleProgress.vue';
import EventsLimitIndicator from './EventsLimitIndicator.vue';

export default Vue.extend({
  name: 'WorkspaceInfo',
  components: {
    EntityImage,
    CircleProgress,
    Icon,
  },
  props: {
    /**
     * @type {Workspace} - workspace id whose information should be displayed
     */
    workspace: {
      type: Object,
      required: true,
    },
  },
  data() {
    return  {
      /**
       * For deboucing the popover mouseleave event.
       */
      popoverTimout: -1,
    };
  },
  computed: {
    /**
     * @returns {boolean} - shows whether the current user is an admin for this workspace
     */
    isAdmin():boolean {
      return this.$store.getters.isCurrentUserAdmin(this.workspace.id);
    },
    /**
     * Return workspace plan
     * @returns {Plan} - return the plan of the
     */
    plan(): Plan {
      return this.workspace.plan;
    },
    /**
     * Total number of used events since the last charge date
     * @returns {number} - total number of used events.
     */
    eventsCount():number {
      return this.workspace.billingPeriodEventsCount || 0;
    },
  },
  methods: {
    createProjectButtonClicked() {
      this.$store.dispatch(SET_MODAL_DIALOG, { component: 'ProjectCreationDialog' });
    },
    /**
     * Show the event indicator popover.
     */
    eventsIndicatorMouseover() {
      window.clearTimeout(this.popoverTimout);
      this.$popover.open({
        component:EventsLimitIndicator,
        componentProps:{
          workspace:this.workspace,
        },
        popoverProps:{
          top: '65px',
          left: '208px',
        },
      });
    },
    /**
     * Close the event indicator popover.
     */
    eventsIndicatorMouseleave() {
      this.popoverTimout = window.setTimeout(() => {
        this.$popover.close();
      }, 200);
    },
  },
});
</script>

<style>
.workspace-info {
  display: flex;
  align-items: center;
  height: 36px;
  font-size: 14px;
  line-height: 16px;

  &__wrapper {
    max-width: 200px;
  }

  &__image {
    margin-right: 15px;
  }

  &__name {
    overflow: hidden;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__settings-link {
    display: block;
    margin-top: 2px;
    color: var(--color-text-second);
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  &__project-creation-button {
    width: 26px;
    height: 26px;
    margin-left: 14px;
    padding: 6px;
    background-color: var(--color-indicator-medium);
    border-radius: var(--border-radius);
    cursor: pointer;
  }

  &__event-indicator {
    position: relative;
    margin-left: auto;
    line-height: 0px;
  }
}
</style>
