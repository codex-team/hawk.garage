<template>
  <div class="workspace-info clearfix">
    <EntityImage
      class="workspace-info__image"
      :name="workspace.name"
      :image="workspace.image"
      :id="workspace.id"
    />
    <Icon
      class="workspace-info__project-creation-button"
      symbol="plus"
    />
    <div class="workspace-info__name">
      {{workspace.name}}
    </div>
    <div class="workspace-info__settings-link">
      Workspace settings
    </div>
  </div>
</template>

<script>
import Icon from '../Icon';
import EntityImage from '../EntityImage';

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
  height: 36px;
  font-size: 14px;
  line-height: 16px;

  &__image {
    float: left;
    width: 36px;
    margin-right: 15px;
  }

  &__name {
    font-weight: 600;
  }

  &__settings-link {
    margin-top: 2px;
    color: var(--color-text-second);
  }

  &__project-creation-button {
    position: relative;
    top: 5px;
    float: right;
    width: 26px;
    height: 26px;
    padding: 6px;
    background-color: var(--color-indicator-medium);
    border-radius: var(--border-radius);
  }
}
</style>
