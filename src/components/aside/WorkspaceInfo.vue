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
        :to="{ name: 'workspace-settings', params: {workspaceId: workspace.id} }"
      >
        {{ $t('workspaces.settings.label') }}
      </router-link>
    </div>
     <div class="workspace-info__events-limit">
      <CircleProgress
        :current="this.usedEventCount"
        :max="this.plan.eventsLimit || 0"
      />
      <div class="workspace-info__events-limit-popup-dialog">
        Data to be Display
      </div>
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
import PositiveButton from '../utils/PostivieButton.vue';
import { Plan } from '../../types/plan';
import Progress from '../utils/Progress.vue';
import CircleProgress from '../utils/CircleProgress.vue';

export default Vue.extend({
  name: 'WorkspaceInfo',
  components: {
    EntityImage,
    Icon,
    PositiveButton,
    Progress,
    CircleProgress
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
  computed: {
     /**
     * Return workspace plan
     * @returns {Plan} - return the plan of the 
     */
    plan(): Plan {
      return this.workspace.plan;
    },
    /**
     * Checking the volume spent
     * @returns {boolean} - shows whether the volume limit exceeded or not.
     */
    isEventsLimitExceeded(): boolean {
      return this.plan.eventsLimit <= this.workspace.billingPeriodEventsCount;
    },
     /**
     * Total number of used events since the last charge date
     * @returns {number} - total number of used events.
     */
    usedEventCount():number {
      return this.workspace.billingPeriodEventsCount || 0;
    },
    /**
     * @returns {boolean} - shows whether the current user is an admin for this workspace
     */
    isAdmin(): boolean {
      return this.$store.getters.isCurrentUserAdmin(this.workspace.id);
    },
  },
  methods: {
    createProjectButtonClicked() {
      this.$store.dispatch(SET_MODAL_DIALOG, { component: 'ProjectCreationDialog' });
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

    &__events-limit {
      margin-left: auto;
      position: relative;
      line-height: 0px;

      &-popup-dialog{
        position: absolute;
        background-color: var(--color-bg-second);
        top: 125%;
        right: -150%;
        opacity: 0;
        z-index: 1;
        width:200px;
        padding:10px;
        border-radius:10px;

        &::after {
          content: " ";
          position: absolute;
          bottom: 100%; 
          left: 77%;
          margin-left: -10px;
          border-width: 6px;
          border-style: solid;
          border-color: transparent transparent var(--color-bg-second) transparent;
        }
      }
      &:hover &-popup-dialog {
        opacity: 1;
        pointer-events: auto;
      }
    }
  }
</style>
