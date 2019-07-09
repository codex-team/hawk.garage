<template>
  <div class="sidebar">
    <div
      class="sidebar__user-picture"
      @click="$router.push('/settings')"
    ></div>
    <hr class="sidebar__delimiter">
    <div class="sidebar__button-create-wrapper">
      <div
        class="sidebar__button-create"
        @click="$emit('createWorkspaceButtonClicked')"
      >
        <Icon symbol="plus"></Icon>
      </div>
    </div>
    <hr class="sidebar__delimiter">
    <div class="sidebar__workspaces-menu" v-if="workspaces.length">
      <div ref="workspaceHighlight" class="sidebar__workspace-highlight"></div>
      <WorkspacesMenuItem
        v-for="workspace in workspaces"
        :key="workspace.id"
        :workspace="workspace"
        :active="activeWorkspace ? activeWorkspace.id === workspace.id : false"
        class="sidebar__workspace-item"
        @dblclick.native="$emit('createProjectButtonClicked')"
        @click.native="onWorkspaceItemClick($event, workspace)"
      />
    </div>
  </div>
</template>

<script>

import Icon from '../Icon';
import WorkspacesMenuItem from './WorkspacesMenuItem';

export default {
  name: 'Sidebar',
  components: {
    WorkspacesMenuItem,
    Icon
  },
  data() {
    return {
      /**
       * Current workspace id
       */
      activeWorkspace: null
    };
  },
  methods: {
    /**
     * Works when workspace item is clicked
     */
    onWorkspaceItemClick($event, workspace) {
      this.$emit('workspaceSelected', workspace);
      this.activeWorkspace = workspace;
      const highLightPadding = 9;

      this.$refs.workspaceHighlight.style.top =
          $event.target.offsetTop - highLightPadding + 'px';
    }
  },
  computed: {
    /**
     * @return {Array<Workspace>} - registered workspaces
     */
    workspaces() {
      return this.$store.state.workspaces.list;
    }
  }
};
</script>

<style>
  .sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 76px;
    background-color: var(--color-bg-sidebar);

    &__user-picture {
      width: 36px;
      height: 36px;
      margin-top: 20px;
      margin-bottom: 18px;
      background: url("https://capella.pics/a45c947c-8708-4d80-8ca2-e60f4d404bd8.jpg") center center;
      background-size: cover;
      border-radius: var(--border-radius);
    }

    &__button-create-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 0;
    }

    &__delimiter {
      width: 36px;
      margin: 0;
      border: 0.5px solid color-mod(var(--color-text-second) alpha(10%));
    }

    &__button-create {
      display: flex;
      width: 36px;
      height: 36px;
      border: solid 1px var(--color-text-main);
      border-radius: 9px;
      cursor: pointer;

      .icon {
        width: 16px;
        height: 16px;
        margin: auto;
      }
    }

    &__workspaces-menu {
      position: relative;
      margin-top: 20px;
    }

    &__workspace-item {
      position: relative;
      z-index: 10;
      margin-bottom: 20px;
    }

    &__workspace-highlight {
      position: absolute;
      top: -300px;
      z-index: 0;
      width: 65px;
      height: 54px;
      margin-left: -9px;
      background: var(--color-bg-main);
      border-top-left-radius: var(--border-radius);
      border-bottom-left-radius: var(--border-radius);
      transition: top 150ms cubic-bezier(.37, -0.19, .42, 1.39);

      &::before,
      &::after {
        position: absolute;
        right: 0;
        display: block;
        width: 10px;
        height: 10px;
        content: '';
      }

      &::before {
        top: -10px;
        background-image: radial-gradient(circle at 0 0, rgba(21, 23, 30, 0) 9px, var(--color-bg-main) 10px);
      }

      &::after {
        bottom: -10px;
        background-image: radial-gradient(circle at 0 100%, rgba(21, 23, 30, 0) 9px, var(--color-bg-main) 10px);
      }
    }
  }
</style>
