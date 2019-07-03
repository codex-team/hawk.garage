<template>
  <div class="app-shell">
    <aside class="aside">
      <Sidebar/>
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
    <div class="app-shell__content">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>

import { THEME_CHANGE } from '../store/actions/app';
import { FETCH_WORKSPACES } from '../store/actions/workspaces';
import { Themes } from '../store/modules/app';
import ProjectsMenuItem from '../components/AppShell/ProjectsMenuItem';
import Sidebar from '../components/AppShell/Sidebar';

export default {
  name: 'AppShell',
  components: {
    Sidebar,
    ProjectsMenuItem
  },
  methods: {
    /**
     * Toggles theme (dark/light)
     */
    changeTheme() {
      this.$store.commit(THEME_CHANGE, this.$store.state.app.theme === Themes.DARK ? Themes.LIGHT : Themes.DARK);
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
  .app-shell {
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

    &__right-column {
      width: 342px;
    }
  }
</style>
