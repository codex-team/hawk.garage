<template>
  <div
    class="project-menu-item"
    :class="{'project-menu-item--current': project.id === currentProjectId}"
    data-ripple
  >
    <EntityImage
      :id="project.id"
      class="project-menu-item__picture"
      :name="project.name"
      :image="project.image"
      size="26"
    />
    <div class="project-menu-item__info">
      <div
        class="project-menu-item__name"
      >
        <!-- eslint-disable vue/no-v-html -->
        <span
          :title="project.name"
          v-html="name"
        />
        <ProjectBadge
          v-for="(badge, index) in projectBadges(project.name)"
          :key="index"
        >
          {{ badge }}
        </ProjectBadge>
        <Icon
          v-if="isWorkspaceBlocked"
          symbol="attention-sign"
          class="project-menu-item__blocked-icon"
        />
      </div>
      <div class="project-menu-item__last-event">
        {{ lastEventTitle }}
      </div>
    </div>
    <Badge
      v-if="project.unreadCount > 0"
      :content="project.unreadCount"
      class="project-menu-item__events-number"
    />
  </div>
</template>

<script>
import Badge from '../utils/Badge';
import EntityImage from '../utils/EntityImage';
import { misTranslit, escape, trim } from '../../utils';
import ProjectBadge from '@/components/project/ProjectBadge';
import { projectBadges } from '@/mixins/projectBadges';
import Icon from '../utils/Icon.vue';

export default {
  name: 'ProjectsMenuItem',
  components: {
    ProjectBadge,
    Badge,
    EntityImage,
    Icon,
  },
  mixins: [projectBadges],
  props: {
    projectId: {
      type: String,
      required: true,
    },
    searchQuery: {
      type: String,
      default: null,
    },
  },
  computed: {
    /**
     * Returns project id from the route
     *
     * @returns {string}
     */
    currentProjectId() {
      return this.$route.params.projectId;
    },

    project() {
      return this.$store.getters.getProjectById(this.projectId);
    },

    lastEventTitle() {
      const latestEvent = this.project.latestEvent;

      if (latestEvent) {
        const latestEventInfo = this.$store.getters.getProjectEventById(this.project.id, latestEvent.eventId);

        return latestEventInfo.payload.title;
      }

      return 'No one catcher connected';
    },
    name() {
      const escapedName = escape(this.nameWithoutBadges(this.project.name));

      const searchConditions = [
        this.searchQuery,
        escape(this.searchQuery),
        misTranslit(this.searchQuery),
        escape(misTranslit(this.searchQuery)),
      ];

      const nameMaxLen = 20;
      const name = trim(escapedName, nameMaxLen);

      if (this.searchQuery) {
        return name.replace(new RegExp(`${searchConditions.join('|')}`, 'gi'), (match) => {
          return `<span class="searched">${match}</span>`;
        });
      } else {
        return name;
      }
    },

    /**
     * Current workspace
     */
    workspace() {
      return this.$store.getters.getWorkspaceById(this.project.workspaceId);
    },

    /**
     * Check if workspace is blocked
     */
    isWorkspaceBlocked() {
      return this.workspace?.isBlocked;
    },
  },
};
</script>

<style>
  .project-menu-item {
    --picture-size: 26px;
    --picture-margin: 15px;

    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    max-height: 62px;
    margin:5px 10px;
    padding: 8px 10px;
    color: var(--color-text-main);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: background-color 110ms ease;
    user-select: none;

    &:hover {
      background-color: var(--color-bg-second);
    }

    &--current {
      background: var(--color-bg-sidebar);

      &:hover {
        background: color-mod(var(--color-bg-sidebar) lightness(+11%));
      }
    }

    &__info {
      max-width: calc(100% - var(--picture-size) - var(--picture-margin) - 45px); /* 45 is estimated badge (2-digit) width */
    }

    &__name {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      color: var(--color-text-main);
      font-weight: 500;
      font-size: 14px;
      white-space: nowrap;

      .project__badge {
        margin: -2px 0 -2px 8px;
      }
    }

    &__last-event {
      width: 206px;
      overflow: hidden;
      color: var(--color-text-second);
      font-size: 12.6px;
      line-height: 1.27;
      letter-spacing: 0.1px;
      white-space: nowrap;
      text-overflow: ellipsis;

      /*display: -webkit-box;*/
      /*-webkit-line-clamp: 2;*/
      /*-webkit-box-orient: vertical;*/
    }

    &__picture {
      margin-right: var(--picture-margin);
    }

    &__events-number {
      margin: auto 0 auto auto;
    }

    &__blocked-icon {
      width: 16px;
      height: 16px;
      margin-left: 8px;
      color: var(--color-indicator-critical);
    }
  }
</style>
