<template>
  <div class="workspace-volume settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('workspaces.settings.volume.title') }}
    </div>
    <div class="workspace-volume__text">{{ $t('workspaces.settings.volume.description_1', {msg: plan.eventsLimit}) }}</div>
    <label class="label">{{ $t('workspaces.settings.volume.title') }}</label>
    <div class="events-limit-indicator__events">
      {{ eventsCount }} /
      {{ plan.eventsLimit }}
      {{ $tc("billing.volumeEvents", eventsCount) }}
    </div>
    <Progress
      :max="plan.eventsLimit || 0"
      :current="eventsCount"
      :color="
        eventsCount / (plan.eventsLimit || eventsCount) >= 0.9
        ? 'var(--color-indicator-critical)'
        : 'rgba(219, 230, 255, 0.6)'"
      class="events-limit-indicator__volume-progress workspace-volume__volume-progress"
    />
    <div class="workspace-volume__text">{{ $t('workspaces.settings.volume.description_2') }}</div>
    <a class="button workspace-volume__button" href="mailto:team@hawk.so">
      {{ $t('workspaces.settings.volume.emailButton') }}
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Progress from "../../utils/Progress.vue";
import {Plan} from "../../../types/plan";

export default Vue.extend({
  name: 'WorkspaceSettingsUsedVolume',
  components: {
    Progress,
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
  data() {
    return {
      /**
       * Threshold For Events Limit.
       */
      thresholdForEventsLimit : 0.9,
    };
  },
  computed: {
    /**
     * Return workspace plan
     *
     * @returns {Plan} - return the plan of the
     */
    plan(): Plan {
      return this.workspace.plan;
    },
    /**
     * Checking the volume spent
     *
     * @returns {boolean} - shows whether the volume limit exceeded or not.
     */
    isEventsLimitExceeded(): boolean {
      const FRACTION = this.eventsCount / this.plan.eventsLimit;

      return FRACTION >= this.thresholdForEventsLimit;
    },
    /**
     * Total number of used events since the last charge date
     *
     * @returns {number} - total number of used events.
     */
    eventsCount(): number {
      return this.workspace.billingPeriodEventsCount || 0;
    },
  },
});
</script>

<style>
@import "../../../styles/settings-window-page.css";

.workspace-volume {
  &__text {
    margin-bottom: 35px;
    max-width: 435px;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: .16px;
    color: var(--color-text-second);
  }

  &__volume-progress {
    width: 400px;
    height: 11px;
    border-radius: 5px;
    margin-bottom: 30px;
  }

  &__button {
    display: inline-block;
    padding: 12px;
    font-weight: 700;
  }
}
</style>
