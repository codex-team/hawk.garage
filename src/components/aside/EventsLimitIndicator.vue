<template>
  <div class="events-limit-indicator__tooltip-dialog">
    <div class="events-limit-indicator__info-section">
      <div class="events-limit-indicator__label">
        {{ $t("billing.volume") }}
        <!--        <PositiveButton-->
        <!--          v-if="isEventsLimitExceeded && isCurrentUserAdmin"-->
        <!--          class="events-limit-indicator__label-boost-button"-->
        <!--          :content="$t('billing.boost') + '!'"-->
        <!--          @click="goToBilling"-->
        <!--        />-->
      </div>
      <div class="events-limit-indicator__info-bar">
        <div class="events-limit-indicator__events">
          {{ abbreviatedEventsCount }} /
          {{ abbreviatedEventsLimit }}
          {{ $t("billing.volumeEvents", { count: eventsCount }) }}
        </div>
        <ProgressBar
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import PositiveButton from '../utils/PostivieButton.vue';
import { Plan } from '../../types/plan';
import ProgressBar from '../utils/Progress.vue';
import { abbreviateNumber } from '../../utils';

export default defineComponent({
  name: 'EventsLimitIndicator',
  components: {
    // PositiveButton,
    ProgressBar,
  },
  props: {
    /**
     * @type {Workspace} - workspace id whose information should be displayed
     */
    workspace: {
      type: Object,
      required: true,
    },

    /**
     * Determines the admin status of the current user
     */
    isCurrentUserAdmin: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      /**
       * Threshold For Events Limit.
       */
      thresholdForEventsLimit: 0.9,
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
    /**
     * Abbreviated events count
     *
     * @returns {string} - abbreviated events count
     */
    abbreviatedEventsCount(): string {
      return abbreviateNumber(this.eventsCount || 0);
    },
    /**
     * Abbreviated events limit
     *
     * @returns {string} - abbreviated events limit
     */
    abbreviatedEventsLimit(): string {
      return abbreviateNumber(this.plan.eventsLimit || 0);
    },
  },
  methods: {
    /**
     * Provides navigation to the Billing page
     */
    goToBilling(): void {
      this.$root.$router.push(`/workspace/${this.workspace.id}/settings/billing`);
    },
  },
});
</script>

<style lang="postcss">
@import './../../styles/custom-properties.css';

.events-limit-indicator {
  &__info {
    margin-top: 20px;

    &-section {
      display: flex;
      flex-direction: column;
    }

    &-bar {
      padding-top: 3px;
    }
  }

  &__label {
    @mixin ui-label;
    display: flex;
    justify-content: space-between;

    &-boost-button {
      margin-top: 14px;
    }
  }

  &__volume-progress {
    width: 163px;
    height: 5px;
    margin-top: 7px;
    background-color: color-mod(var(--color-border) alpha(25%));
  }

  &__events {
    margin-top: 15px;
    color: var(--color-text-main);
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.18px;
    white-space: nowrap;
  }
}
</style>
