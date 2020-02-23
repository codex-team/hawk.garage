<template>
  <div
    class="project-menu-item"
  >
    <EntityImage
      :id="project.id"
      class="project-menu-item__picture"
      :name="project.name"
      :image="project.image"
    />
    <div class="project-menu-item__info">
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="project-menu-item__name"
        v-html="name"
      />
      <div class="project-menu-item__last-event">
        {{ lastEventTitle }}
      </div>
    </div>
    <Badge
      :content="project.unreadCount"
      class="project-menu-item__events-number"
    />
  </div>
</template>

<script>
import Badge from '../utils/Badge';
import EntityImage from '../utils/EntityImage';
import { misTranslit, escape } from '../../utils';

export default {
  name: 'ProjectsMenuItem',
  components: {
    Badge,
    EntityImage,
  },
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
      const escapedName = escape(this.project.name);

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
    padding: 6px 20px;
    color: var(--color-text-main);
    cursor: pointer;
    user-select: none;

    &__name {
      margin-bottom: 5px;
      color: var(--color-text-main);
      font-weight: 500;
      font-size: 14px;
    }

    &__last-event {
      display: -webkit-box;
      width: 206px;
      height: 30px;
      overflow: hidden;
      color: var(--color-text-second);
      font-size: 12.6px;
      line-height: 1.27;
      letter-spacing: 0.1px;

      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &__picture {
      width: 26px;
      height: 26px;
      margin-right: 15px;
      font-size: 12px;
      line-height: 26px;
    }

    &__events-number {
      margin: auto 0 auto auto;
    }

    &:hover {
      background-color: var(--color-bg-second);
    }
  }
</style>
