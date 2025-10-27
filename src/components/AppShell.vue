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
          v-model="searchQuery"
          class="aside__search-field"
          :placeholder="$t('forms.searchField')"
        />
        <div
          v-if="projects.length"
          class="aside__projects-list"
        >
          <ProjectsMenuItem
            v-for="project in projects"
            :key="project.id"
            :search-query="searchQuery"
            :project-id="project.id"
            @click="onProjectMenuItemClick(project)"
          />
        </div>
        <EmptyProjectsList
          v-else-if="currentWorkspace"
          :workspace="currentWorkspace"
        />
      </div>
    </aside>
    <div class="app-shell__content">
      <ProjectPlaceholder v-if="!$route.params.projectId" />
      <router-view :key="$route.params.projectId" />
    </div>
    <component
      :is="modalComponent"
      v-bind="modalDialogData"
      @close="onModalClose"
    />
  </div>
</template>

<script>
import { defineComponent, markRaw } from 'vue';

import { FETCH_INITIAL_DATA } from '../store/modules/app/actionTypes';
import { SET_CURRENT_WORKSPACE } from '../store/modules/workspaces/actionTypes';
import Sidebar from './sidebar/Sidebar';
import SearchField from './forms/SearchField';
import WorkspaceInfo from './aside/WorkspaceInfo';
import ProjectsMenuItem from './aside/ProjectsMenuItem';
import EmptyProjectsList from './aside/EmptyProjectsList';
import ProjectPlaceholder from './project/ProjectPlaceholder';
import { FETCH_CURRENT_USER } from '../store/modules/user/actionTypes';
import { RESET_MODAL_DIALOG, SET_MODAL_DIALOG } from '../store/modules/modalDialog/actionTypes';
import { mapState, mapGetters } from 'vuex';
import { misTranslit } from '../utils';

export default defineComponent({
  name: 'AppShell',
  components: {
    Sidebar,
    ProjectsMenuItem,
    SearchField,
    WorkspaceInfo,
    ProjectPlaceholder,
    EmptyProjectsList,
  },
  props: {
    /**
     * Current workspace id
     */
    workspaceId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      /**
       * Current opened modal window - используем markRaw для избежания реактивности
       */
      modalComponent: null,
      searchQuery: '',
    };
  },
  computed: {
    /**
     * Current opened modal window
     */
    ...mapState({
      modalDialogComponent: state => state.modalDialog.component,
      modalDialogData: state => state.modalDialog.data,
    }),

    ...mapGetters({
      getEvent: 'getProjectEventRepetition',
    }),

    /**
     * @returns {Array<Workspace>} - registered workspaces
     */
    workspaces() {
      return this.$store.state.workspaces.list;
    },

    /**
     * @returns {Array<Project>} - list of current projects
     */
    projects() {
      let projectList = this.$store.state.projects.list
        .map(project => {
          let latestEvent = null;

          if (project.latestEvent) {
            const latestEventId = project.latestEvent.eventId;

            latestEvent = this.getEvent(project.id, latestEventId);
          }

          return {
            id: project.id,
            name: project.name,
            workspaceId: project.workspaceId,
            latestEvent,
            timestamp: new Date(latestEvent ? latestEvent.timestamp : 0), // timestamp of the last occurred event
          };
        });

      if (this.searchQuery) {
        const searchConditions = [
          this.searchQuery,
          misTranslit(this.searchQuery),
        ];

        const searchRegexp = new RegExp(`${searchConditions.join('|')}`, 'gi');

        projectList = projectList.filter(project => {
          return searchRegexp.test(project.name);
        });
      }

      projectList.sort((firstProject, secondProject) => {
        return secondProject.timestamp - firstProject.timestamp;
      });

      if (!this.currentWorkspace) {
        return projectList;
      }

      return projectList
        .filter(project => project.workspaceId === this.currentWorkspace.id);
    },

    /**
     * Getter for current user workspace
     *
     * @returns {Workspace}
     */
    currentWorkspace() {
      return this.$store.state.workspaces.current;
    },
  },
  watch: {
    modalDialogComponent(componentName) {
      if (!componentName) {
        this.modalComponent = null;

        return;
      }

      import(`./modals/${componentName}.vue`)
        .then(module => {
          this.modalComponent = markRaw(module.default);
        })
        .catch(error => {
          console.error(`Failed to load modal component: ${componentName}`, error);

          this.modalComponent = null;
        });
    },
    /**
     * When the workspace changes user goes to the '/' or 'workspace/:workspaceId' routes
     *
     * @param workspace - new workspace
     */
    currentWorkspace(workspace) {
      /**
       * User goes to workspace page only from '/' and 'workspace/:workspaceId' routes
       */
      if (this.$route.path === '/' || this.$route.path.includes('workspace')) {
        /**
         * If workspace is null and user on the 'workspace/:workspaceId' route (else user goes to
         * the same route and will get error in console) then user goes to the '/' route.
         */
        if (!workspace && this.workspaceId) {
          return this.$router.push('/');
        }

        /**
         * If workspace is not null and user is not on the same workspace (else user goes to
         * the same route and will get error in console) then user goes to the '/workspace/:workspaceId'
         */
        if (workspace && this.workspaceId !== workspace.id) {
          this.$router.push({
            name: 'workspace',
            params: {
              workspaceId: workspace.id,
            },
          });
        }
      }
    },
  },
  /**
   * Vue hook. Called synchronously after the instance is created
   */
  async created() {
    try {
      /**
       * Fetch user data
       */
      await this.$store.dispatch(FETCH_INITIAL_DATA);

      this.$store.dispatch(RESET_MODAL_DIALOG);

      /**
       * Onboarding. If a user has no workspace, show Create Workspace modal
       */
      this.suggestWorkspaceCreation();

      /**
       * Get current workspace
       */
      const workspace = this.$store.getters.getWorkspaceById(this.workspaceId);

      /**
       * Set current workspace
       */
      this.$store.dispatch(SET_CURRENT_WORKSPACE, workspace);

      /**
       * Fetch current user data
       */
      this.$store.dispatch(FETCH_CURRENT_USER);
    } catch (error) {
      console.error(error);
      this.$sendToHawk(`Error on app initialization!: ${error.message}`);
    }
  },
  methods: {
    onModalClose() {
      this.$store.dispatch(RESET_MODAL_DIALOG);
    },

    /**
     * Opens project overview page or catcher installation page if not already connected
     *
     * @param {Project} project - clicked project
     */
    onProjectMenuItemClick(project) {
      if (!project.latestEvent) {
        return this.$router.push({
          name: 'add-catcher',
          params: { projectId: project.id },
        }, () => {
          // do nothing
        });
      }

      this.$router.push({
        name: 'project-overview',
        params: { projectId: project.id },
      }, () => {
        // do nothing
      });
    },

    /**
     * Onboarding. If a user has no workspace, show Create Workspace modal
     *
     * @returns {void}
     */
    suggestWorkspaceCreation() {
      if (this.$store.state.workspaces.list.length > 0) {
        return;
      }

      this.$store.dispatch(SET_MODAL_DIALOG, { component: 'WorkspaceCreationDialog' });
    }
  }
});

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
  }

  .aside {
    display: flex;
    background-color: var(--color-bg-main);

    &__right-column {
      @mixin hide-scrollbar;
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
