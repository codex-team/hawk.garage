<template>
  <div class="project-header">
    <div class="project-header__project">
      <div
        v-if="project"
        class="project-header__row"
        @click="
          $router.push({ name: 'project-settings-general', params: { projectId: project.id } })
        "
      >
        <EntityImage
          :id="project.id"
          :name="project.name"
          :image="project.image"
          size="26"
        />
        <div class="project-header__row-title">
          <span
            class="project-header__row-title-text"
            :title="project.name"
          >{{
            nameWithoutBadges(project.name)
          }}</span>
          <ProjectBadge
            v-for="(badge, index) in projectBadges(project.name)"
            :key="index"
          >
            {{ badge }}
          </ProjectBadge>
          <Icon
            v-if="workspace && workspace.isBlocked"
            symbol="attention-sign"
            class="project-header__blocked-icon"
          />
        </div>
      </div>
      <div
        v-else
        class="project-header__row-skeleton"
      >
        <div class="project-header__row-skeleton-image" />
        <div class="project-header__row-skeleton-title" />
      </div>
      <UiButton
        v-if="project"
        class="project-header__settings-button"
        icon="dots"
        iconic
        @click="
          $router.push({ name: 'project-settings-general', params: { projectId: project.id } })
        "
      />
    </div>
    <TabBar
      :items="tabs"
      :active-item-index="activeTabIndex"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import EntityImage from '../utils/EntityImage.vue';
import ProjectBadge from './ProjectBadge.vue';
import { projectBadges } from '../../mixins/projectBadges';
import TabBar, { TabInfo } from '../utils/TabBar.vue';
import UiButton from '../utils/UiButton.vue';
import Icon from '../utils/Icon.vue';
import { Project } from '@/types/project';

export default Vue.extend({
  name: 'ProjectHeader',
  components: {
    ProjectBadge,
    EntityImage,
    TabBar,
    UiButton,
    Icon,
  },
  mixins: [ projectBadges ],
  computed: {
    /**
     * Currently viewed project
     */
    project(): Project | null {
      const projectId = this.$route.params.projectId;

      return this.$store.getters.getProjectById(projectId);
    },

    /**
     * Current workspace
     */
    workspace(): any {
      if (!this.project) {
        return null;
      }

      return this.$store.getters.getWorkspaceById((this.project as any).workspaceId);
    },

    /**
     * Active tab index
     */
    activeTabIndex(): number {
      return this.$route.name === 'project-releases' ? 1 : 0;
    },

    /**
     * Tabs for the project
     */
    tabs(): TabInfo[] {
      return [
        {
          title: this.$t('projects.tabs.events') as string,
          routeName: 'project-overview',
        },
        {
          title: this.$t('projects.tabs.releases') as string,
          routeName: 'project-releases',
        },
      ];
    },
  },
});
</script>

<style>
.project-header {
  background-color: var(--color-bg-main);
  border-bottom: 1px solid var(--color-bg-main);
  border-left: 1px solid var(--color-bg-second);
  padding-inline: var(--layout-padding-inline);

  &__project {
    display: flex;
    align-items: center;
    padding-block: 12px;
  }

  &__row {
    display: flex;
    flex: 1;
    align-items: center;
    min-width: 0;
    cursor: pointer;

    &-title {
      display: flex;
      flex-shrink: 1;
      align-items: center;
      min-width: 0;
      margin-left: 10px;
      color: var(--color-text-main);
      font-weight: bold;
      font-size: 15px;

      &-text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  &__blocked-icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-left: 8px;
    color: var(--color-indicator-critical);
  }
}

&__settings-button {
  flex-shrink: 0;
  margin-top: -5px;
  margin-bottom: -5px;
  margin-left: auto;
}

&__row-skeleton {
  display: flex;
  align-items: center;

  &-image {
    width: 26px;
    height: 26px;
    margin-right: 10px;
    background-color: var(--color-bg-second);
    border-radius: 6px;
  }

  &-title {
    width: 100px;
    height: 15px;
    background-color: var(--color-bg-second);
    border-radius: 6px;
  }
}

.tab-bar {
  height: 42px;
}

&__notifications {
  flex-shrink: 0;
  width: 17px;
  height: 20px;
  margin-right: 19px;
  margin-left: auto;
  cursor: pointer;
}
</style>
