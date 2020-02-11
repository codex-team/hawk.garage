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
        @click="createWorkspaceButtonClicked"
      >
        <Icon symbol="plus" />
      </div>
    </div>
    <hr class="sidebar__delimiter">
    <div
      :class="{'sidebar__workspaces-menu--scrolled': isWorkspaceMenuScrolled}"
      class="sidebar__workspaces-menu"
    >
      <div
        class="sidebar__scrollable"
        @scroll.passive="activateScrollableGradient"
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
  </div>
</template>

<script>

import Icon from '../utils/Icon';
import WorkspacesMenuItem from './WorkspacesMenuItem';
import { SET_CURRENT_WORKSPACE } from '../../store/modules/workspaces/actionTypes';
import EntityImage from '../utils/EntityImage';
import { SET_MODAL_DIALOG } from '../../store/modules/modalDialog/actionTypes';

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
      highlightPosition: '0px',

      /**
       * If true, gradient in workspaces list will be applied
       */
      isWorkspaceMenuScrolled: false
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
      const workspacesListPadding = 20;

      this.highlightPosition = workspaceItemHeight * workspaceIndex - highlightPadding + workspacesListPadding + 'px';
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
    },

    createWorkspaceButtonClicked() {
      this.$store.dispatch(SET_MODAL_DIALOG, { component: 'WorkspaceCreationDialog' });
    },

    /**
     * When user scroll down workspaces list show gradients on top and hide it if user scrolled up
     * @param {Event} event - scroll event
     */
    activateScrollableGradient(event) {
      /**
       * Scroll top offset to show gradient
       */
      const minimumDistance = 5;

      this.isWorkspaceMenuScrolled = event.target.scrollTop > minimumDistance;
    }
  }
};
</script>

<style>
  @import "../../styles/custom-properties.css";

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
      display: flex;
      align-content: center;
      width: 100%;
      margin-bottom: 20px;
      overflow: hidden;

      &::after {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 10;
        height: 20px;
        background: linear-gradient(to bottom, rgba(26, 29, 38, 0) 0%, rgba(26, 29, 38, 1) 90%);
        content: '';
      }

      &::before {
        opacity: 0;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        transition: all 170ms ease;
        z-index: 10;
        height: 40px;
        background: linear-gradient(to bottom, rgba(26, 29, 38, 1) 50%, rgba(26, 29, 38, 0) 100%);
        content: '';
      }

      &--scrolled {
        &::before {
          opacity: 1;
        }
      }
    }

    &__scrollable {
      @apply --hide-scrollbar;
      position: relative;
      max-height: 100%;
      padding-top: 20px;
      overflow: scroll;
    }

    &__workspace-item {
      position: relative;
      z-index: 1;
      margin: 0 20px 20px 20px;
    }

    &__workspace-highlight {
      position: absolute;
      top: -300px;
      right: 0;
      width: 65px;
      height: 54px;
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
