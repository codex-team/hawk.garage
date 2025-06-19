<template>
  <div class="workspaces-menu-item-wrapper">
    <EntityImage
      :id="workspace.id"
      class="workspaces-menu-item"
      :class="{ 'workspaces-menu-item--active': active }"
      :title="workspace.name"
      :name="workspace.name"
      :image="workspace.image"
      size="36"
    />
    <Icon
      v-if="workspace && workspace.isBlocked"
      symbol="attention-sign"
      class="workspaces-menu-item__blocked-icon"
    />
  </div>
</template>

<script>
import EntityImage from '../utils/EntityImage';
import Icon from '../utils/Icon';

export default {
  name: 'WorkspacesMenuItem',
  components: {
    EntityImage,
    Icon,
  },
  props: {
    /**
     * @type {workspace}
     */
    workspace: {
      type: Object,
      required: true,
    },

    /**
     * @type {boolean} is item selected
     */
    active: Boolean,
  },
};
</script>

<style>
.workspaces-menu-item-wrapper {
  position: relative;
}

.workspaces-menu-item {
  cursor: pointer;
  user-select: none;

  &--active {
    box-shadow: 0 5px 4px -3px rgba(0, 0, 0, 0.57);
    transform: scale(1.05);
    transition: transform 150ms ease;
  }

  &__blocked-icon {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    color: var(--color-indicator-critical);
  }
}
</style>
