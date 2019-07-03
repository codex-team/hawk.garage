<template>
  <div class="home">
    <aside class="aside">
      <div class="aside__left-column">
        <div
          class="aside__user-picture"
          @click="logout"
        ></div>
        <div class="aside__button-create-wrapper">
          <div
            class="aside__button-create"
            @click="$router.push('/workspaces/create')"
          >
            <Icon symbol="plus"></Icon>
          </div>
        </div>
        <div class="aside__workspaces-menu" v-if="workspaces.length">
          <div ref="workspaceHighlight" class="aside__workspace-highlight"></div>
          <WorkspacesMenuItem
            v-for="workspace in workspaces"
            :key="workspace.id"
            :workspace="workspace"
            :active="activeWorkspaceId === workspace.id"
            class="aside__workspace-item"
            @click.native="onWorkspaceItemClick($event, workspace.id)"
          />
        </div>
      </div>
      <div class="aside__right-column">
        <div class="aside__projects-list" v-if="projects">
          <ProjectsMenuItem
            v-for="project in projects"
            :key="project.id"
            :project="project"
            @click.native="$router.push({ name: 'project-overview', params: { projectId: project.id }})"
          ></ProjectsMenuItem>
        </div>
      </div>
    </aside>
    <div class="home__content">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>

import { RESET_STORE } from '../store/actions';
import { THEME_CHANGE } from '../store/actions/app';
import { FETCH_WORKSPACES } from '../store/actions/workspaces';
import { Themes } from '../store/modules/app';
import ProjectsMenuItem from '../components/ProjectsMenuItem';
import Icon from '../components/Icon';
import WorkspacesMenuItem from '../components/WorkspacesMenuItem';

export default {
  name: 'Home',
  components: {
    WorkspacesMenuItem,
    ProjectsMenuItem,
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
     * Toggles theme (dark/light)
     */
    changeTheme() {
      this.$store.commit(THEME_CHANGE, this.$store.state.app.theme === Themes.DARK ? Themes.LIGHT : Themes.DARK);
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

  /**
   * Vue hook. Called synchronously after the instance is created
   */
  created() {
    /**
     * Fetch user data
     */
    this.$store.dispatch(FETCH_WORKSPACES);
  },
  computed: {
    /**
     * @return {Array<Workspace>} - registered workspaces
     */
    workspaces() {
      return this.$store.state.workspaces.list;
    },
    /**
     * @return {Array<Project>} - list of all projects
     */
    projects() {
      return this.$store.getters.allProjects;
    }
  }
};

</script>

<style>
  .home {
    display: flex;
    min-height: 100%;

    &__content {
      flex-grow: 1;
      overflow: hidden;

      background-color: var(--color-bg-second);
    }
  }

  .aside {
    display: flex;

    background-color: var(--color-bg-main);

    &__left-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 76px;

      background-color: #1a1d26;
    }

    &__user-picture {
      width: 36px;
      height: 36px;
      margin-top: 20px;
      margin-bottom: 18px;

      background: url("https://capella.pics/a45c947c-8708-4d80-8ca2-e60f4d404bd8.jpg") center center;
      background-size: cover;
      border-radius: 10px;
    }

    &__button-create-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px;
      padding: 20px;

      border-top: 1px solid rgba(219, 230, 255, 0.1);
      border-bottom: 1px solid rgba(219, 230, 255, 0.1);
    }

    &__button-create {
      box-sizing: border-box;
      width: 36px;
      height: 36px;
      margin: auto;

      background-color: #1a1d26;
      border: solid 1px var(--color-text-main);
      border-radius: 9px;
      cursor: pointer;

      .icon {
        width: 16px;
        height: 16px;
        padding: 10px;
      }
    }

    &__workspaces-menu {
      position: relative;

      padding: 0 20px 24px;
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

        background-image: radial-gradient(circle at 0 0, transparent 9px, var(--color-bg-main) 10px);
      }

      &:after {
        bottom: -10px;

        background-image: radial-gradient(circle at 0 100%, transparent 9px, var(--color-bg-main) 10px);
      }
    }

    &__right-column {
      width: 342px;
    }
  }
</style>
