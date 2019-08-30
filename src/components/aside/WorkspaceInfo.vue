<template>
  <div class="workspace-info">
    <EntityImage
      :id="workspace.id"
      class="workspace-info__image"
      :name="workspace.name"
      :image="workspace.image"
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
    <Icon
      class="workspace-info__project-creation-button"
      symbol="plus"
      @click.native="createProjectButtonClicked"
    />
  </div>
</template>

<script>
import Icon from '../utils/Icon';
import EntityImage from '../utils/EntityImage';
import ProjectCreationDialog from '../modals/ProjectCreationDialog';
import { SET_MODAL_DIALOG } from '../../store/modules/modalDialog/actionTypes';

export default {
  name: 'WorkspaceInfo',
  components: {
    EntityImage,
    Icon
  },
  props: {
    /**
     * @type {Workspace} workspace whose information should be displayed
     */
    workspace: {
      type: Object,
      required: true
    }
  },
  methods: {
    createProjectButtonClicked() {
      this.$store.dispatch(SET_MODAL_DIALOG, { component: 'ProjectCreationDialog' });
    }
  }
};
</script>

<style>
  .workspace-info {
    display: flex;
    align-items: center;
    height: 36px;
    font-size: 14px;
    line-height: 16px;

    &__image {
      width: 36px;
      height: 36px;
      margin-right: 15px;
    }

    &__name {
      font-weight: 600;
    }

    &__settings-link {
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
      margin-left: auto;
      padding: 6px;
      background-color: var(--color-indicator-medium);
      border-radius: var(--border-radius);
      cursor: pointer;
    }
  }
</style>
