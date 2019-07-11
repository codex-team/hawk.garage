<template>
  <div class="app-shell">
    <aside class="aside">
      <Sidebar
        @createWorkspaceButtonClicked="openWorkspaceCreationDialog"
      />
      <div class="aside__right-column">
        <WorkspaceInfo
          class="aside__workspace-info"
          v-if="currentWorkspace"
          :workspace="currentWorkspace"
          @createProjectButtonClicked="openProjectCreationDialog"
        />
        <SearchField
          class="aside__search-field"
        />
        <div class="aside__projects-list" v-if="projects">
          <ProjectsMenuItem
            v-for="project in projects"
            :key="project.id"
            :project="project"
            @click.native="$router.push({ name: 'project-overview', params: { projectId: project.id }})"
          />
        </div>
      </div>
    </aside>
    <div class="app-shell__content">
      <router-view :key="$route.fullPath"></router-view>
    </div>
    <component @close="modalDialog = null" :is="modalDialog"></component>
  </div>
</template>

<script>

import { THEME_CHANGE } from '../store/actions/app';
import { FETCH_WORKSPACES, SET_CURRENT_WORKSPACE } from '../store/actions/workspaces';
import { Themes } from '../store/modules/app';
import Sidebar from './sidebar/Sidebar';
import WorkspaceCreationDialog from './workspaces/CreationDialog';
import ProjectCreationDialog from './projects/CreationDialog';
import SearchField from './forms/SearchField';
import WorkspaceInfo from './aside/WorkspaceInfo';
import ProjectsMenuItem from './aside/ProjectsMenuItem';

export default {
  name: 'AppShell',
  components: {
    Sidebar,
    ProjectsMenuItem,
    SearchField,
    WorkspaceInfo
  },
  data() {
    return {
      /**
       * Current opened modal window
       */
      modalDialog: null
    };
  },
  methods: {
    /**
     * Toggles theme (dark/light)
     */
    changeTheme() {
      this.$store.commit(THEME_CHANGE, this.$store.state.app.theme === Themes.DARK ? Themes.LIGHT : Themes.DARK);
    },

    /**
     * Opens modal window to create new workspace
     */
    openWorkspaceCreationDialog() {
      this.modalDialog = WorkspaceCreationDialog;
    },

    /**
     * Opens modal window to create new project
     */
    openProjectCreationDialog() {
      this.modalDialog = ProjectCreationDialog;
    }
  },

  /**
   * Vue hook. Called synchronously after the instance is created
   */
  created() {
    /**
     * Reset current workspace
     */
    this.$store.dispatch(SET_CURRENT_WORKSPACE, null);

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
     * @return {Array<Project>} - list of current projects
     */
    projects() {
      if (!this.$store.state.workspaces.current) return this.$store.getters.allProjects;
      return this.$store.state.workspaces.list
        .find(ws => ws.id === this.$store.state.workspaces.current.id)
        .projects;
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
      overflow-y: auto;
    }

    &__search-field {
      margin: 20px;
    }

    &__workspace-info {
      margin: 20px;
    }
  }
</style>
