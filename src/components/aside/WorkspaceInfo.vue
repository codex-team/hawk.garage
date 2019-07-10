<template>
  <div class="workspace-info">
    <EntityImage
      class="workspace-info__image"
      :name="workspace.name"
      :image="workspace.image"
      :id="workspace.id"
    />
    <div class="workspace-info__wrapper">
      <div class="workspace-info__name">
        {{workspace.name}}
      </div>
      <div class="workspace-info__settings-link">
        Workspace settings
      </div>
    </div>
    <Icon
      @click.native="$emit('createProjectButtonClicked')"
      class="workspace-info__project-creation-button"
      symbol="plus"
    />
  </div>
</template>

<script>
import Icon from '../utils/Icon';
import EntityImage from '../utils/EntityImage';

export default {
  name: 'WorkspaceInfo',
  props: {
    /**
     * @type {Workspace} workspace whose information should be displayed
     */
    workspace: {
      type: Object,
      required: true
    }
  },
  components: {
    EntityImage,
    Icon
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
