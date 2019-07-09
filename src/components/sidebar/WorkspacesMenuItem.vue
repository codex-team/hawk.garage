<template>
  <div
    class="workspaces-menu-item"
    :class="{'workspaces-menu-item--active': active}"
    :title="workspace.name"
    :style="{
      backgroundImage: workspace.image ? `url('${workspace.image}')`: 'none',
      backgroundColor: bgColor
    }"
  >
    {{!workspace.image ? $options.filters.abbreviation(workspace.name) : ''}}
  </div>
</template>

<script>

export default {
  name: 'WorkspacesMenuItem',
  props: {
    /**
     * @type {workspace}
     */
    workspace: {
      type: Object,
      required: true
    },

    /**
     * @type {Boolean} is item selected
     */
    active: Boolean
  }
};
</script>

<style>
  .workspaces-menu-item {
    width: 36px;
    height: 36px;
    font-weight: bold;

    font-size: 12px;
    line-height: 36px;
    text-align: center;
    background-position: center center;
    background-size: cover;
    border-radius: var(--border-radius);
    cursor: pointer;
    user-select: none;

    &--active {
      box-shadow: 0 5px 4px -3px rgba(0, 0, 0, 0.57);
      transform: scale(1.05);
      transition: transform 150ms ease;
    }
  }
</style>
