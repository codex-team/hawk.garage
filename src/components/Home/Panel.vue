<template>
  <div class="home-panel">
    <div
      class="home-panel__user-picture"
      @click="logout"
    ></div>
    <hr class="home-panel__delimiter">
    <div class="home-panel__button-create-wrapper">
      <div
        class="home-panel__button-create"
        @click="$router.push('/workspaces/create')"
      >
        <Icon symbol="plus"></Icon>
      </div>
    </div>
    <hr class="home-panel__delimiter">
    <div class="home-panel__workspaces-menu" v-if="workspaces.length">
      <div ref="workspaceHighlight" class="home-panel__workspace-highlight"></div>
      <WorkspacesMenuItem
        v-for="workspace in workspaces"
        :key="workspace.id"
        :workspace="workspace"
        :active="activeWorkspaceId === workspace.id"
        class="home-panel__workspace-item"
        @click.native="onWorkspaceItemClick($event, workspace.id)"
      />
    </div>
  </div>
</template>

<script>

import { RESET_STORE } from '../../store/actions';
import Icon from '../Icon';
import WorkspacesMenuItem from './WorkspacesMenuItem';

export default {
  name: 'Panel',
  components: {
    WorkspacesMenuItem,
    Icon
  },
  data() {
    return {
      /**
       * Current workspace id
       */
      activeWorkspaceId: null
    };
  },
  methods: {
    /**
     * Logouts user
     */
    logout() {
      this.$store.dispatch(RESET_STORE);
    },

    /**
     * Works when workspace item is clicked
     */
    onWorkspaceItemClick($event, workspaceId) {
      this.activeWorkspaceId = workspaceId;
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
  .home-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 76px;

    background-color: #1a1d26;

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

      border: 1px solid rgba(219, 230, 255, 0.1);
    }

    &__button-create {
      display: flex;
      box-sizing: border-box;
      width: 36px;
      height: 36px;

      background-color: #1a1d26;
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
      top: -9px;
      z-index: 0;

      width: 65px;
      height: 54px;
      margin-left: -9px;

      background: var(--color-bg-main);
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;

      transition: top 150ms cubic-bezier(.37, -0.19, .42, 1.39);

      &:before,
      &:after {
        position: absolute;
        right: 0;

        display: block;
        width: 10px;
        height: 10px;

        content: '';
      }

      &:before {
        top: -10px;

        background-image: radial-gradient(circle at 0 0, rgba(21, 23, 30, 0) 9px, var(--color-bg-main) 10px);
      }

      &:after {
        bottom: -10px;

        background-image: radial-gradient(circle at 0 100%, rgba(21, 23, 30, 0) 9px, var(--color-bg-main) 10px);
      }
    }
  }
</style>
