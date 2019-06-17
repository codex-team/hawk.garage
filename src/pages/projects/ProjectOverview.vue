<template>
  <div class="project-overview">
    <div class="project-overview__header">
      <div
        class="project-overview__icon"
        :style="{ backgroundImage: `url('${project.picture}')` }"
      ></div>
      <div class="project-overview__name">
        {{project.name}}
      </div>
      <div class="project-overview__notifications"></div>
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
    background-color: var(--color-bg-second);
    height: 100%;

    &__header {
      display: flex;
      align-items: center;
      height: 50px;
      box-shadow: 0 1px 5px 0 var(--color-bg-main), inset 0 1px 3px 0 rgba(0, 0, 0, 0.5);
    }

    &__icon {
      width: 26px;
      height: 26px;
      background-size: cover;
      background-position: center center;
      border-radius: 10px;
      margin-left: 15px;
    }

    &__name {
      color: var(--color-text-main);
      font-weight: bold;
      font-size: 15px;
      margin-left: 10px;
    }

    &__chart {
      height: 215px;
      background-color: var(--color-bg-main);
      margin: 16px 15px 15px;
    }
  }
</style>
