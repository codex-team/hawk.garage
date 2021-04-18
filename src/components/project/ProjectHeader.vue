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
        {{ projectName }}
        <span
          v-for="(badge, index) in projectBadges"
          :key="index"
          class="project-header__badge"
        >
          {{ badge }}
        </span>
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

export default {
  name: 'ProjectHeader',
  components: {
    EntityImage,
    Icon,
  },
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

    /**
     * Returns parsed badges from project name
     *
     * @returns {string[]}
     */
    projectBadges() {
      const name = this.project.name;

      const badgeRegex = /\[(.*?)]/gm;

      return name.match(badgeRegex)
        .map(badge => badge.slice(1, -1));
    },

    /**
     * Returns project name without badges
     *
     * @returns {string}
     */
    projectName() {
      const name = this.project.name;

      const badgeRegex = / ?\[(.*?)]/gm;

      return name.replaceAll(badgeRegex, '');
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
    cursor: pointer;
    overflow: hidden;
  }

  &__name {
    display: flex;
    align-items: center;
    margin-left: 10px;
    color: var(--color-text-main);
    font-weight: bold;
    font-size: 15px;
    overflow: hidden;
  }

  &__badge {
    border-radius: 3px;
    border: 1px solid var(--color-border);
    color: var(--color-text-second);
    font-weight: normal;
    font-size: 9px;
    padding: 1px 2px;
    margin-left: 7px;

    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__notifications {
    width: 17px;
    height: 20px;
    margin-right: 19px;
    margin-left: auto;
    cursor: pointer;
    flex-shrink: 0;
  }
}
</style>
