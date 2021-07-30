<template>
  <div
    v-if="project"
    class="project-header"
  >
    <div
      class="project-header__title-container"
      @click="$router.push({name: 'project-settings-general', params: {projectId: project.id}})"
    >
      <EntityImage
        :id="project.id"
        :name="project.name"
        :image="project.image"
        size="26"
      />
      <div class="project-header__name">
        {{ nameWithoutBadges(project.name) }}
        <ProjectBadge
          v-for="(badge, index) in projectBadges(project.name)"
          :key="index"
        >
          {{ badge }}
        </ProjectBadge>
      </div>
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
import ProjectBadge from '@/components/project/ProjectBadge';
import { projectBadges } from '@/mixins/projectBadges';

export default {
  name: 'ProjectHeader',
  components: {
    ProjectBadge,
    EntityImage,
    Icon,
  },
  mixins: [projectBadges],
  computed: {
    /**
     * Current viewed project
     *
     * @returns {Project}
     */
    project() {
      const projectId = this.$route.params.projectId;

      return this.$store.getters.getProjectById(projectId);
    },
  },
};
</script>

<style>
.project-header {
  display: flex;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid var(--color-bg-main);

  &__title-container {
    display:flex;
    align-items: center;
    height: 100%;
    padding: 0 15px;
    overflow: hidden;
    cursor: pointer;
  }

  &__name {
    display: flex;
    align-items: center;
    margin-left: 10px;
    color: var(--color-text-main);
    font-weight: bold;
    font-size: 15px;
  }

  &__notifications {
    flex-shrink: 0;
    width: 17px;
    height: 20px;
    margin-right: 19px;
    margin-left: auto;
    cursor: pointer;
  }
}
</style>
