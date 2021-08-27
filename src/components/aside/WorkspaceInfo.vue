<template>
  <div class="workspace-info">
    <EntityImage
      :id="workspace.id"
      class="workspace-info__image"
      :name="workspace.name"
      :image="workspace.image"
      size="36"
    />
    <div class="workspace-info__wrapper">
      <div class="workspace-info__name">
        {{ workspace.name }}
      </div>
      <router-link
        class="workspace-info__settings-link"
        :to="{
          name: 'workspace-settings',
          params: { workspaceId: workspace.id },
        }"
      >
        {{ $t("workspaces.settings.label") }}
      </router-link>
    </div>
    <div class="events-limit">
      <CircleProgress :current="eventCount" :max="plan.eventsLimit || 0" />
      <div class="events-limit__popup-dialog">
        <div class="events-limit__info-section">
          <div class="events-limit__label">
            {{ $t('billing.volume') }}
            <PositiveButton
              v-if="isEventsLimitExceeded"
              :content="$t('billing.boost') + '!'"
            />
          </div>
          <div class="events-limit__info-bar">
            <div class="events-limit__events">
              {{ eventsCount || 0 | spacedNumber }} / {{ plan.eventsLimit || 0 | spacedNumber }} {{ $tc('billing.volumeEvents', eventsCount) }}
            </div>
            <Progress
              :max="plan.eventsLimit || 0"
              :current="eventsCount"
              :color="(eventsCount / (plan.eventsLimit || eventsCount)) > 0.8 ? '#d94848' : 'rgba(219, 230, 255, 0.6)'"
              class="events-limit__volume-progress"
            />
          </div>
        </div>
      </div>
    </div>
    <Icon
      v-if="isAdmin"
      class="workspace-info__project-creation-button"
      symbol="plus"
      @click.native="createProjectButtonClicked"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '../utils/Icon.vue';
import EntityImage from '../utils/EntityImage.vue';
import { SET_MODAL_DIALOG } from '@/store/modules/modalDialog/actionTypes';
import PositiveButton from '../utils/PostivieButton.vue';
import { Plan } from '../../types/plan';
import Progress from '../utils/Progress.vue';
import CircleProgress from '../utils/CircleProgress.vue';

export default Vue.extend({
  name: 'WorkspaceInfo',
  components: {
    EntityImage,
    Icon,
    PositiveButton,
    Progress,
    CircleProgress,
  },
  props: {
    /**
     * @type {Workspace} - workspace id whose information should be displayed
     */
    workspace: {
      type: Object,
      required: true,
    },
  },
  computed: {
    /**
     * Return workspace plan
     * @returns {Plan} - return the plan of the
     */
    plan(): Plan {
      return this.workspace.plan;
    },
    /**
     * Checking the volume spent
     * @returns {boolean} - shows whether the volume limit exceeded or not.
     */
    isEventsLimitExceeded(): boolean {
      return this.plan.eventsLimit <= this.workspace.billingPeriodEventsCount;
    },
    /**
     * Total number of used events since the last charge date
     * @returns {number} - total number of used events.
     */
    eventCount():number {
      return this.workspace.billingPeriodEventsCount || 0;
    },
    /**
     * @returns {boolean} - shows whether the current user is an admin for this workspace
     */
    isAdmin(): boolean {
      return this.$store.getters.isCurrentUserAdmin(this.workspace.id);
    },
  },
  methods: {
    createProjectButtonClicked() {
      this.$store.dispatch(SET_MODAL_DIALOG, { component: 'ProjectCreationDialog' });
    },
  },
});
</script>

<style>
.workspace-info {
  display: flex;
  align-items: center;
  height: 36px;
  font-size: 14px;
  line-height: 16px;

  &__wrapper {
    max-width: 200px;
  }

  &__image {
    margin-right: 15px;
  }

  &__name {
    overflow: hidden;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__settings-link {
    display: block;
    margin-top: 2px;
    color: var(--color-text-second);
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  &__project-creation-button {
    width: 26px;
    height: 26px;
    margin-left: 14px;
    padding: 6px;
    background-color: var(--color-indicator-medium);
    border-radius: var(--border-radius);
    cursor: pointer;
  }
}
.events-limit {
  position: relative;
  margin-left: auto;
  line-height: 0px;

  &__popup-dialog {
    position: absolute;
    z-index: 1;
    top: 150%;
    right: -170%;
    width: 194px;
    height: 90px;
    background-color: var(--color-bg-second);
    box-shadow: 0 10px 23px 0 rgba(0, 0, 0, 0.34);
    border-radius: 10px;
    visibility: hidden;
    line-height: normal;
    padding: 15px;

    &::after {
      position: absolute;
      bottom: 100%;
      left: 70%;
      margin-left: -14px;
      border-color: transparent transparent var(--color-bg-second) transparent;
      border-style: solid;
      border-width: 10px;
      content: " ";
    }
  }

  &:hover &__popup-dialog {
    visibility: visible;
    pointer-events: auto;
  }

  &__info {
      margin-top: 20px;

      &-section {
        display: flex;
        flex-direction: column;

        &:not(:last-of-type){
          margin-right: 30px;
        }
      }

      &-bar {
        padding-top: 3px;
      }
    }

    &__label {
      @apply --ui-label;
      display: inline-block;
      margin-right: 13px;
      margin-bottom: 15px;
    }

    &__volume-progress {
      width: 160px;
      height: 5px;
      margin-top: 7px;
      background-color: color-mod(var(--color-border) alpha(25%));
    }

    &__events {
      color: var(--color-text-main);
      font-weight: bold;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0.18px;
      white-space: nowrap;
    }
}
</style>
