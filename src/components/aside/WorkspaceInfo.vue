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
    <EventsLimitIndicator
    :workspace="workspace"
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
import Icon from '../utils/Icon.vue';
import EntityImage from '../utils/EntityImage.vue';
import { SET_MODAL_DIALOG } from '@/store/modules/modalDialog/actionTypes';
import EventsLimitIndicator from './EventsLimitIndicator.vue';

export default {
  name: 'WorkspaceInfo',
  components: {
    EntityImage,
    EventsLimitIndicator,
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
  computed: {
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

  &__project-creation-button {
    width: 26px;
    height: 26px;
    margin-left: 14px;
    padding: 6px;
    background-color: var(--color-indicator-medium);
    border-radius: var(--border-radius);
    cursor: pointer;
  }
}
</style>
