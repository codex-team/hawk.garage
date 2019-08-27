<template>
  <div class="sidebar">
    <EntityImage
      :id="user.id"
      class="sidebar__user-picture"
      :name="user.email || 'H'"
      :image="user.image"
      @click.native="$router.push('/settings')"
    />
    <hr class="sidebar__delimiter">
    <div class="sidebar__button-create-wrapper">
      <div
        class="sidebar__button-create"
        @click="$emit('createWorkspaceButtonClicked')"
      >
        <Icon symbol="plus" />
      </div>
    </div>
    <hr class="sidebar__delimiter">
    <div
      v-if="workspaces.length"
      class="sidebar__workspaces-menu"
    >
      <transition
        name="highlight-appearance"
        appear
      >
        <div
          v-show="currentWorkspace"
          class="sidebar__workspace-highlight"
          :style="{'top': highlightPosition}"
        />
      </transition>
      <WorkspacesMenuItem
        v-for="workspace in workspaces"
        :key="workspace.id"
        :workspace="workspace"
        :active="currentWorkspace ? currentWorkspace.id === workspace.id : false"
        class="sidebar__workspace-item"
        @click.native="onWorkspaceItemClick(workspace)"
      />
    </div>
  </div>
</template>

<script>

import Icon from '../utils/Icon';
import WorkspacesMenuItem from './WorkspacesMenuItem';
import { SET_CURRENT_WORKSPACE } from '../../store/modules/workspaces/actionTypes';
import EntityImage from '../utils/EntityImage';

export default {
  name: 'Sidebar',
  components: {
    EntityImage,
    WorkspacesMenuItem,
    Icon
  },
  data() {
    return {
      /**
       * Position of the highlight element
       */
      highlightPosition: '0px'
    };
  },
  computed: {
    /**
     * @return {Array<Workspace>} - registered workspaces
     */
    workspaces() {
      return this.$store.state.workspaces.list;
    },

    /**
     * Getter for current user workspace
     * @return {Workspace}
     */
    currentWorkspace() {
      return this.$store.state.workspaces.current;
    },

    /**
     * Getter for current user workspace
     * @return {User}
     */
    user() {
      if (this.$store.state.user.data) {
        return this.$store.state.user.data;
      } else {
        return {};
      }
    }
  },
  watch: {
    currentWorkspace(newWorkspace) {
      if (!newWorkspace) return;
      const workspaceIndex = this.workspaces.findIndex(ws => ws.id === this.currentWorkspace.id);
      const highlightPadding = 9;
      const workspaceItemHeight = 56;

      this.highlightPosition = workspaceItemHeight * workspaceIndex - highlightPadding + 'px';
    }
  },
  methods: {
    /**
     * Works when workspace item is clicked
     * @param {Workspace} workspace - clicked workspace
     */
    onWorkspaceItemClick(workspace) {
      if (this.currentWorkspace && this.currentWorkspace.id === workspace.id) {
        return this.$store.dispatch(SET_CURRENT_WORKSPACE, null);
      }
      this.$store.dispatch(SET_CURRENT_WORKSPACE, workspace);
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
      cursor: pointer;
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
      transition: top 150ms cubic-bezier(.37, -0.19, .42, 1.39), opacity 150ms ease, transform 150ms ease;

      &.highlight-appearance-enter,
      &.highlight-appearance-leave-to {
        transform: translateX(10px);
        opacity: 0;
      }

      &.highlight-appearance-enter-to,
      &.highlight-appearance-leave {
        transform: none;
        opacity: 1;
      }

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
