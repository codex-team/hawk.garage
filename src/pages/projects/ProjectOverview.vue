<template>
  <div class="project-overview">
    <div class="project-overview__header">
      {{project.name}}
    </div>
    <div class="project-overview__chart">

    </div>
    <div class="project-overview__errors">

    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectOverview',
  computed: {
    /**
     * Current viewed project
     * @return {Project}
     */
    project() {
      const projectId = this.$route.params.projectId;

      return this.$store.getters.project(projectId);
    }
  }
};
</script>

<style>
  .project-overview {
    display: flex;
    flex-direction: column;
  }
</style>
