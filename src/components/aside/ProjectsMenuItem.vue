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
        <span v-html="name" />
        <ProjectBadge
          v-for="(badge, index) in projectBadges(project.name)"
          :key="index"
        >
          {{ badge }}
        </ProjectBadge>
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
import { misTranslit, escape } from '../../utils';
import ProjectBadge from '@/components/project/ProjectBadge';
import { projectBadges } from '@/mixins/projectBadges';

export default {
  name: 'ProjectsMenuItem',
  components: {
    ProjectBadge,
    Badge,
    EntityImage,
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
      return this.$store.state.projects.list.find(_project => _project.id === this.projectId);
    },

    lastEventTitle() {
      const latestEvents = this.$store.getters.getLatestEvent(this.projectId);

      if (latestEvents) {
        return latestEvents.payload.title;
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

      if (this.searchQuery) {
        return escapedName.replace(new RegExp(`${searchConditions.join('|')}`, 'gi'), (match) => {
          return `<span class="searched">${match}</span>`;
        });
      } else {
        return escapedName;
      }
    },
  },
};
</script>

<style>
  .project-menu-item {
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
        background: color-mod(var(--color-bg-sidebar) lightness(+1%));
      }
    }

    &__info {
      overflow-x: hidden;
    }

    &__name {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      color: var(--color-text-main);
      font-weight: 500;
      font-size: 14px;
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
      margin-right: 15px;
    }

    &__events-number {
      margin: auto 0 auto auto;
    }
  }
</style>
