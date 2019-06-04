<template>
  <div class="home">
    <aside class="home__aside">
      <div class="home__aside-header">
        <button @click="logout">Logout</button>
        <button @click="changeTheme">Change theme</button>
      </div>
      <div class="home__workspaces">
        <img
          class="home__workspace-item"
          v-for="workspace in workspaces"
          :key="workspace.id"
          :src="workspace.picture"
        >
      </div>
      <div class="home__projects">
        <div
          class="home__project-item"
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

    &__aside {
      background-color: var(--color-bg-main);
      min-width: 250px;
    }

    &__content {
      width: 100%;
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
