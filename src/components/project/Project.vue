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
  /**
   * Vue mounted hook
   * Used to update user's last project visit time
   */
  mounted() {
    if (this.project) {
      this.$store.dispatch('UPDATE_PROJECT_LAST_VISIT', { projectId: this.projectId });
    }
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
