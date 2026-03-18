<template>
  <div class="project">
    <ProjectHeader
      class="project__header"
      :project="project"
    />
    <div class="project__content">
      <router-view />
    </div>
  </div>
</template>

<script>
import ProjectHeader from './ProjectHeader';

export default {
  name: 'Project',
  components: {
    ProjectHeader,
  },
  computed: {
    /**
     * Returns project id from the route
     *
     * @returns {string}
     */
    projectId() {
      return this.$route.params.projectId;
    },

    /**
     * Current viewed project
     *
     * @returns {Project}
     */
    project() {
      return this.$store.getters.getProjectById(this.projectId);
    },
  },
  watch: {
    project: {
      handler(newProject, oldProject) {
        if (newProject && !oldProject) {
          this.$store.dispatch('UPDATE_PROJECT_LAST_VISIT', { projectId: this.projectId });
        }
      },
      immediate: true,
    },
  },
};
</script>

<style>
  .project {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    &__header {
      flex-shrink: 0;
    }

    &__content {
      flex-grow: 1;
      overflow: auto;
    }
  }
</style>
