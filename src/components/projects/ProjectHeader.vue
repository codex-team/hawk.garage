<template>
  <div class="project-header">
    <EntityImage
      :id="project.id"
      :name="project.name"
      :image="project.image"
      class="project-header__icon"
    />
    <div class="project-header__name">
      {{ project.name }}
    </div>
    <Icon
      class="project-header__notifications"
      symbol="bell"
    />
  </div>
</template>

<script>
import EntityImage from '../utils/EntityImage';
import Icon from '../utils/Icon';

export default {
  name: 'ProjectHeader',
  components: {
    EntityImage,
    Icon
  },
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
.project-header {
  display: flex;
  align-items: center;
  height: 50px;
  box-shadow: 0 1px 5px 0 var(--color-bg-main), inset 0 1px 3px 0 rgba(0, 0, 0, 0.5);

  &__icon {
    width: 26px;
    height: 26px;
    line-height: 26px;
    margin-left: 15px;
    background-position: center center;
    background-size: cover;
    border-radius: var(--border-radius);
  }

  &__name {
    margin-left: 10px;
    color: var(--color-text-main);
    font-weight: bold;
    font-size: 15px;
  }

  &__notifications {
    width: 17px;
    height: 20px;
    margin-right: 19px;
    margin-left: auto;
    cursor: pointer;
  }
}
</style>
