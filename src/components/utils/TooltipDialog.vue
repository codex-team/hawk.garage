<template>
  <div class="events-limit-indicator">
    <router-link
      :to="{
        name: 'workspace-settings-billing',
        params: { workspaceId: workspace.id },
      }"
    >
      <CircleProgress :current="eventsCount" :max="plan.eventsLimit || 0" />
    </router-link>
    <div class="events-limit-indicator__tooltip-dialog">
      <div class="events-limit-indicator__info-section">
        <div class="events-limit-indicator__label">
          {{ $t("billing.volume") }}
          <PositiveButton
            v-if="isEventsLimitExceeded"
            :content="$t('billing.boost') + '!'"
          />
        </div>
        <div class="events-limit-indicator__info-bar">
          <div class="events-limi__events">
            {{ eventsCount || 0 | abbreviateNumber }} /
            {{ plan.eventsLimit || 0 | abbreviateNumber }}
            {{ $tc("billing.volumeEvents", eventsCount) }}
          </div>
          <Progress
            :max="plan.eventsLimit || 0"
            :current="eventsCount"
            :color="
              eventsCount / (plan.eventsLimit || eventsCount) >= 0.9
                ? 'var(--color-indicator-critical)'
                : 'rgba(219, 230, 255, 0.6)'
            "
            class="events-limit-indicator__volume-progress"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PositiveButton from '../utils/PostivieButton.vue';
import { Plan } from '../../types/plan';
import Progress from '../utils/Progress.vue';
import CircleProgress from '../utils/CircleProgress.vue';

export default Vue.extend({
  name: 'EventsLimitIndicator',
  components: {
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
      const PERCENT = this.eventsCount / this.plan.eventsLimit;

      return PERCENT >= 0.9;
    },
    /**
     * Total number of used events since the last charge date
     * @returns {number} - total number of used events.
     */
    eventsCount():number {
      return this.workspace.billingPeriodEventsCount || 0;
    },
  },
});
</script>

<style>
.events-limit-indicator {
  position: relative;
  margin-left: auto;
  line-height: 0px;

  &__tooltip-dialog {
    position: absolute;
    z-index: 1;
    top: 140%;
    right: -170%;
    background-color: var(--color-bg-second);
    box-shadow: 0 10px 23px 0 rgba(0, 0, 0, 0.34);
    border-radius: 10px;
    opacity: 0;
    line-height: normal;
    padding: 15px;
    transition: opacity 0.1s ease-in;
    pointer-events: none;

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

  &:hover &__tooltip-dialog {
    opacity: 1;
    pointer-events: auto;
  }

  &__info {
    margin-top: 20px;

    &-section {
      display: flex;
      flex-direction: column;

      &:not(:last-of-type) {
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
