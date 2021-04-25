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
        :to="{ name: 'workspace-settings', params: {workspaceId: workspace.id}}"
      >
        {{ $t('workspaces.settings.label') }}
      </router-link>
    </div>
    <CircleProgress
      class="workspace-info__events-limit-circle-progress"
      :current="eventsCount"
      :max="plan.eventsLimit || 0"
      :color="(eventsCount / (plan.eventsLimit || eventsCount)) > 0.8 ? '#d94848' : 'rgba(219, 230, 255, 0.6)'"
    />
    <Icon
      v-if="isAdmin"
      class="workspace-info__project-creation-button"
      symbol="plus"
      @click.native="createProjectButtonClicked"
    />
  </div>
</template>

<script>
import Icon from '../utils/Icon';
import EntityImage from '../utils/EntityImage';
import CircleProgress from '../utils/CircleProgress';
import { SET_MODAL_DIALOG } from '@/store/modules/modalDialog/actionTypes';

export default {
  name: 'WorkspaceInfo',
  components: {
    EntityImage,
    Icon,
    CircleProgress,
  },
  props: {
    /**
     * @type {Workspace} workspace whose information should be displayed
     */
    workspace: {
      type: Object,
      required: true,
    },
  },
  computed: {
    /**
     * Workspace plan
     */
    plan() {
      return this.workspace.plan;
    },

    /**
     * Total number of errors since the last charge date
     */
    eventsCount() {
      return this.workspace.billingPeriodEventsCount || 0;
    },

    /**
     * @returns {boolean} - shows whether the current user is an admin for this workspace
     */
    isAdmin() {
      return this.$store.getters.isCurrentUserAdmin(this.workspace.id);
    },
  },
  methods: {
    createProjectButtonClicked() {
      this.$store.dispatch(SET_MODAL_DIALOG, { component: 'ProjectCreationDialog' });
    },
  },
};
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

    &__events-limit-circle-progress {
      margin-left: 63px;
    }

    &__project-creation-button {
      width: 26px;
      height: 26px;
      margin-left: auto;
      padding: 6px;
      background-color: var(--color-indicator-medium);
      border-radius: var(--border-radius);
      cursor: pointer;
    }
  }
</style>
