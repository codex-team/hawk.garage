<template>
  <div class="app-shell">
    <aside class="aside">
      <Sidebar />
      <div class="aside__right-column">
        <WorkspaceInfo
          v-if="currentWorkspace"
          class="aside__workspace-info"
          :workspace="currentWorkspace"
        />
        <SearchField
          class="aside__search-field"
        />
        <div
          v-if="projects"
          class="aside__projects-list"
        >
          <ProjectsMenuItem
            v-for="project in projects"
            :key="project.id"
            :project="project"
            @click.native="onProjectMenuItemClick(project)"
          />
        </div>
      </div>
    </aside>
    <div class="app-shell__content">
      <ProjectHeader
        v-if="$route.params.projectId"
        class="app-shell__project-header"
      />
      <router-view />
    </div>
    <component
      :is="modalComponent"
      @close="onModalClose"
    />
  </div>
</template>

<script>
import Vue from 'vue';

import { FETCH_INITIAL_DATA } from '../store/modules/app/actionTypes';
import { SET_CURRENT_WORKSPACE } from '../store/modules/workspaces/actionTypes';
import Sidebar from './sidebar/Sidebar';
import SearchField from './forms/SearchField';
import WorkspaceInfo from './aside/WorkspaceInfo';
import ProjectsMenuItem from './aside/ProjectsMenuItem';
import ProjectHeader from './projects/ProjectHeader';
import { FETCH_CURRENT_USER } from '../store/modules/user/actionTypes';
import { RESET_MODAL_DIALOG } from '../store/modules/modelDialog/actionTypes';
import { mapState } from 'vuex';

export default {
  name: 'AppShell',
  components: {
    Sidebar,
    ProjectsMenuItem,
    SearchField,
    WorkspaceInfo,
    ProjectHeader
  },
  data() {
    return {
      modalComponent: null
    };
  },
  computed: {
    /**
     * Current opened modal window
     */
    ...mapState({
      modalDialogComponent: state => state.modalDialog.component
    }),

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
      if (!this.$store.state.workspaces.current) {
        return this.$store.state.projects.list;
      }
      return this.$store.state.projects.list
        .filter(project => project.workspaceId === this.$store.state.workspaces.current.id);
    },

    /**
     * Getter for current user workspace
     * @return {Workspace}
     */
    currentWorkspace() {
      return this.$store.state.workspaces.current;
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
    this.$store.dispatch(FETCH_INITIAL_DATA);

    /**
     * Fetch current user data
     */
    this.$store.dispatch(FETCH_CURRENT_USER);

    this.$store.dispatch(RESET_MODAL_DIALOG);
  },
  methods: {
    onModalClose() {
      this.$store.dispatch(RESET_MODAL_DIALOG);
    },

    /**
     * Opens project overview page or catcher installation page if not already connected
     * @param {Project} project - clicked project
     */
    onProjectMenuItemClick(project) {
      const valuesArray = Object.values(project.eventsListByDate);

      if (!valuesArray.length) {
        return this.$router.push({ name: 'add-catcher', params: { projectId: project.id } }, () => {});
      }
      this.$router.push({ name: 'project-overview', params: { projectId: project.id } }, () => {});
    }
  },

  watch: {
    modalDialogComponent(componentName) {
      if (!componentName) {
        this.modalComponent = null;
        return;
      }

      this.modalComponent = Vue.component(componentName, () => import(/* webpackChunkName: 'modals' */ `./modals/${componentName}`));
    }
  }
};

</script>

<style>
  @import '../styles/custom-properties.css';

  .app-shell {
    display: flex;
    min-height: 100%;

    &__content {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      overflow: hidden;
      background-color: var(--color-bg-second);
    }

    &__project-header {
      flex-shrink: 0;
    }
  }

  .aside {
    display: flex;
    background-color: var(--color-bg-main);

    &__right-column {
      @apply --hide-scrollbar;
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
