<template>
  <EntityImage
    :id="workspace.id"
    class="workspaces-menu-item"
    :class="{'workspaces-menu-item--active': active}"
    :title="workspace.name"
    :name="workspace.name"
    :image="workspace.image"
    size="36"
  />
</template>

<script>
import EntityImage from '../utils/EntityImage';

export default {
  name: 'WorkspacesMenuItem',
  components: {
    EntityImage,
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
  .workspaces-menu-item {
    cursor: pointer;
    user-select: none;

    &--active {
      box-shadow: 0 5px 4px -3px rgba(0, 0, 0, 0.57);
      transform: scale(1.05);
      transition: transform 150ms ease;
    }
  }
</style>
