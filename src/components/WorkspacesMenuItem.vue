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
    {{workspace.name | abbreviation}}
  </div>
</template>

<script>
import { getRandomColor } from '../utils';

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
  },
  data() {
    return {
      /**
       * @type {String} item background color
       */
      bgColor: this.workspace.image ? 'none' : getRandomColor()
    };
  }
};
</script>

<style>
  .workspaces-menu-item {
    display: flex;
    justify-content: center; /* align horizontal */
    align-items: center; /* align vertical */

    width: 36px;
    height: 36px;

    font-size: 20px;
    line-height: 36px;
    text-align: center;
    vertical-align: middle;

    background-position: center center;
    background-size: cover;
    border-radius: 10px;
    cursor: pointer;

    &--active {
      box-shadow: 0 5px 4px -3px rgba(0, 0, 0, 0.57);
      transform: scale(1.05);

      transition: transform 150ms ease;
    }
  }
</style>
