<template>
  <div class="home">
    <aside class="aside">
      <div class="aside__header">
        <div class="aside__user-picture"></div>
        <div class="aside__hawk-title">Hawk</div>
        <div class="aside__user-email">taly@codex.so</div>
      </div>
      <div class="aside__workspaces">
        <img
          class="aside__workspace-item"
          v-for="workspace in workspaces"
          :key="workspace.id"
          :src="workspace.picture"
        >
      </div>
      <div class="aside__projects">
        <div
          class="aside__project-item"
          v-for="project in projects"
          :key="project.id"
        >
          {{project.name}}
        </div>
      </div>
    </aside>
    <div class="home__content">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>

import { AUTH_LOGOUT } from '../store/actions/auth';
import { THEME_CHANGE } from '../store/actions/app';
import { Themes } from '../store/modules/app';

export default {
  name: 'Home',
  methods: {
    /**
     * Logouts user
     */
    logout() {
      this.$store.commit(AUTH_LOGOUT);
    },
    /**
     * Toggles theme (dark/light)
     */
    changeTheme() {
      this.$store.commit(THEME_CHANGE, this.$store.state.app.theme === Themes.DARK ? Themes.LIGHT : Themes.DARK);
    }
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
      width: 100%;
    }
  }

  .aside {
    background-color: var(--color-bg-main);
    min-width: 250px;
    padding: 20px;

    &__header {
      /*display: flex;*/
      /*flex-direction: column;*/
    }

    &__user-picture {
      float: right;
      width: 40px;
      height: 40px;
      border-radius: 11px;
      background: url("https://capella.pics/a45c947c-8708-4d80-8ca2-e60f4d404bd8.jpg") center center;
      background-size: cover;
    }

    &__hawk-title {
      color: var(--color-text-main);
      font-weight: bold;
      letter-spacing: 0.19px;
    }

    &__user-email {
      color: var(--color-text-second);
      font-size: 14px;
    }

    &__workspace-item {
      display: inline;
      width: 26px;
      height: 26px;
      border-radius: 10px;
      margin-left: 15px;
    }

    &__project-item {
      color: var(--color-text-main);
    }
  }
</style>
