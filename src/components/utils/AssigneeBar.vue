<template>
  <div
    class="assignee-bar"
  >
    <span>{{ $t('event.viewedBy.assignee') }}</span>
    <div
      class="assignee-bar__button"
      @click.stop="changeAssigneeShowed"
    >
      <Icon
        v-if="!event.assignee"
        symbol="assignee"
        class="assignee-bar__icon"
      />
      <EntityImage
        v-else
        :id="event.assignee.id"
        class="assignee-bar__image"
        :image="event.assignee.image"
        :name="event.assignee.name || event.assignee.email"
        :title="event.assignee.name || event.assignee.email"
        size="14"
      />
      <Icon
        :class="[{
          'assignee-bar__arrow-down--rotate': isAssigneesShowed
        }, 'assignee-bar__arrow-down']"
        symbol="arrow-down"
      />
    </div>
    <AssigneesList
      v-if="isAssigneesShowed"
      v-click-outside="hideAssigneesList"
      :project-id="projectId"
      :event-id="event.id"
      triangle="top"
      class="assignee-bar__assignees-list"
      @hide="hideAssigneesList"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import EntityImage from './EntityImage.vue';
import Icon from './Icon.vue';
import AssigneesList from '../event/AssigneesList.vue';

import { HawkEvent } from '@/types/events';

export default Vue.extend({
  name: 'AssigneeBar',
  components: {
    EntityImage,
    Icon,
    AssigneesList,
  },
  props: {
    /**
     * Event data
     */
    event: {
      type: Object as () => HawkEvent,
      default: null,
    },

    /**
     * Project id of the event
     */
    projectId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      /**
       * Show assignees list
       */
      isAssigneesShowed: false,
    };
  },
  methods: {
    /**
     * Hide or show assignees list
     */
    changeAssigneeShowed(): void {
      this.isAssigneesShowed = !this.isAssigneesShowed;
    },

    /**
     * Hide assignees list
     */
    hideAssigneesList(): void {
      this.isAssigneesShowed = false;
    },
  },
});
</script>

<style>
.assignee-bar {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 30px;
  color: var(--color-text-second);

  &__button {
    display: flex;
    align-items: center;
    margin-left: 10px;
    padding: 4px 7px 4px 4px;
    background: var(--color-bg-main);
    border-radius: 7px;
    cursor: pointer;
  }

  &__icon {
    width: 14px;
    min-width: 14px;
    height: 14px;
    min-height: 14px;
    background: var(--color-bg-second);
    border-radius: 3px;
  }

  &__arrow-down {
    width: 11px;
    min-width: 11px;
    height: 11px;
    min-height: 11px;
    margin-left: 6px;
    transition: 0.1s;

    &--rotate {
      transform: rotate(180deg);
    }
  }

  &__assignees-list {
    position: absolute;
    top: 50px;
    right: -30px;
    z-index: 1;
  }
}
</style>