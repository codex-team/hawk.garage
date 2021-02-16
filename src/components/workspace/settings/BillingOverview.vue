<template>
  <div class="billing-card">
    <UiSwitch
      class="billing-card__switch"
      :label="$t('billing.autoPay')"
    />
    <div class="clearfix billing-card__workspace">
      <EntityImage
        :id="workspace.id"
        :title="workspace.name"
        :name="workspace.name"
        :image="workspace.image"
        size="27"
        class="billing-card__workspace-logo"
      />
      {{ workspace.name }}
      <div
        v-if="isVolumeSpent || isSubExpired"
        class="billing-card__workspace-blocked"
      >
        {{ $t('billing.blocked') }}
      </div>
    </div>

    <div class="billing-card__info">
      <!-- Plan -->
      <section
        class="billing-card__info-section billing-card__current-plan"
        @click="onPlanClick"
      >
        <div class="billing-card__label">
          {{ $t('billing.currentPlan') }}
        </div>
        <div
          v-if="isVolumeSpent"
          class="billing-card__attention"
        >
          <div class="billing-card__attention__mark">!</div>
        </div>
        <div class="billing-card__plan">
          <div class="billing-card__plan-name">
            {{ plan.name || 'Free' }}
          </div>
          <div class="billing-card__plan-coast">
            {{ plan.monthlyCharge || 0 }}$/{{ $t('billing.payPeriod') }}
          </div>
        </div>
      </section>

      <!-- Valid till -->
      <section
        v-if="workspace.plan.name !== 'Free'"
        class="billing-card__info-section"
      >
        <div class="billing-card__label">
          {{ $t('billing.validTill').toUpperCase() }}
        </div>
        <div
          v-if="isVolumeSpent"
          class="billing-card__mock"
        ></div>
        <div class="billing-card__info-bar">
          <div class="billing-card__events">
            {{ isSubExpired ? $t('billing.expired') : '' }}{{ workspace.subValidTill | prettyDateFromDateTimeString }}
          </div>
          <Progress
            :max="progressMaxDate"
            :current="progressCurrentDate"
            :color="workspace.autoPay ? 'rgba(219, 230, 255, 0.6)' : (progressCurrentDate / progressMaxDate) > 0.8 ? '#d94848' : 'rgba(219, 230, 255, 0.6)'"
            class="billing-card__volume-progress"
          />
        </div>
      </section>

      <!-- Volume -->
      <section class="billing-card__info-section"
      >
        <div class="billing-card__label">
          {{ $t('billing.volume') }}
        </div>
        <button
          v-if="isVolumeSpent"
          class="billing-card__volume-boost"
          @click="onBoostClick()"
        >
          {{ $t('billing.boost') + '!' }}
        </button>
        <div class="billing-card__info-bar">
          <div class="billing-card__events">
            {{ eventsCount || 0 | spacedNumber }} / {{ plan.eventsLimit || 0 | spacedNumber }} {{ $tc('billing.volumeEvents', eventsCount) }}
          </div>
          <Progress
            :max="plan.eventsLimit || 0"
            :current="eventsCount"
            :color="(eventsCount / (plan.eventsLimit || eventsCount)) > 0.8 ? '#d94848' : 'rgba(219, 230, 255, 0.6)'"
            class="billing-card__volume-progress"
          />
        </div>
      </section>
    </div>
    <div class="billing-card__buttons">
      <UiButton
        v-for="(button, index) in buttons"
        :key="'button:' + index"
        :submit="button.style === 'primary'"
        :content="button.label"
        @click="button.onClick"
      />
    </div>
    <div
      v-if="workspace.autoPay"
      class="billing-card__autopay-is-on"
    >
      {{ 'Autopay is on.The next payment date:' }} {{ workspace.subValidTill | prettyDateFromDateTimeString }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import EntityImage from '../../utils/EntityImage.vue';
import Progress from '../../utils/Progress.vue';
import UiSwitch from '../../forms/UiSwitch.vue';
import { SET_MODAL_DIALOG } from '../../../store/modules/modalDialog/actionTypes';
import UiButton from './../../utils/UiButton.vue';
import { Plan } from '../../../types/plan';
import Button from '../../../types/button';
import { Workspace } from '../../../types/workspaces';

export default Vue.extend({
  name: 'BillingOverview',
  components: {
    UiSwitch,
    Progress,
    EntityImage,
    UiButton,
  },
  props: {
    workspace: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      incrementEventsLimit: {
        label: this.$i18n.t('Increment events limit') as string,
        style: 'primary',
        onClick: () => {
          console.log('Increment events limit');
        },
      },
      enableAutoPayment: {
        label: this.$i18n.t('Enable auto payment') as string,
        style: 'primary',
        onClick: () => {
          console.log('Enable auto payment');
        },
      },
      prolongateCurrentPlan: {
        label: this.$i18n.t('Prolongate current plan') as string,
        style: 'secondary',
        onClick: () => {
          console.log('Prolongate current plan');
        },
      },
      now: new Date(),
    };
  },
  computed: {
    /**
     * Return workspace plan
     */
    plan(): Plan {
      return this.workspace.plan;
    },
    /**
     * Total number of errors since the last charge date
     */
    eventsCount(): number {
      return this.workspace.billingPeriodEventsCount || 0;
    },
    /**
     * Return a valid buttons
     */
    buttons(): Button[] {
      const validButtons: Button[] = [];

      if (this.workspace.plan.name === 'Free') {
        return [ this.incrementEventsLimit ];
      }

      if (!this.workspace.autoPay) {
        validButtons.push(this.enableAutoPayment);

        if (this.isSubExpired) {
          validButtons.push(this.prolongateCurrentPlan);
          console.log('Sub expired');

          return validButtons;
        }

        if (this.isVolumeSpent) {
          return [ this.incrementEventsLimit ];
        }
      } else if (this.isVolumeSpent) {
        return [ this.incrementEventsLimit ];
      }

      return validButtons;
    },
    /**
     * Checking the volume spent
     */
    isVolumeSpent(): boolean {
      return this.workspace.plan.eventsLimit === this.workspace.billingPeriodEventsCount;
    },
    /**
     * Checking the subscription expiration
     */
    isSubExpired(): boolean {
      const validTill = new Date(this.workspace.subValidTill);

      return validTill < this.now;
    },
    /**
     * Return the date in ms from sub created date to sub last date
     */
    progressMaxDate(): number {
      return this.diffDates(this.workspace.subValidTill, this.dateAMonthAgo(this.workspace.subValidTill).toDateString());
    },
    /**
     * Return the date in ms from sub created date to current date
     */
    progressCurrentDate(): number {
      return this.diffDates(this.now.toDateString(), this.dateAMonthAgo(this.workspace.subValidTill).toDateString());
    },
  },
  mounted() {
    this.now = new Date();
  },
  methods: {
    processPayment(amount): void {
      this.$store.dispatch(SET_MODAL_DIALOG, {
        component: 'ProcessPaymentDialog',
        data: { amount },
      });
    },
    /**
     * Open ChooseTariffPlan popup on click on the current plan button
     */
    onPlanClick(): void {
      this.$store.dispatch(SET_MODAL_DIALOG, {
        component: 'ChooseTariffPlanPopup',
        data: {
          workspaceId: this.workspace.id,
        },
      });
    },
    /**
     * Open the same popup like `onPlanClick`
     */
    onBoostClick(): void {
      console.log('Boost click');
    },
    /**
     * Return the date a month ago
     *
     * @param dateString - date string
     */
    dateAMonthAgo(dateString: string): Date {
      const date = new Date(dateString);
      const monthAgo = new Date(dateString);

      monthAgo.setMonth(date.getMonth() - 1 < 0 ? 11 : date.getMonth() - 1);

      return monthAgo;
    },
    /**
     * Difference between dates
     *
     * @param dateString1 - first date
     * @param dateString2 - second date
     */
    diffDates(dateString1: string, dateString2: string): number {
      const date1 = new Date(dateString1);
      const date2 = new Date(dateString2);

      return Math.abs(date1.getTime() - date2.getTime());
    },
  },
});
</script>

<style lang="postcss">
  @import url('./../../../styles/custom-properties.css');

  .billing-card {
    width: var(--width-popup-form-container);
    margin-bottom: 20px;
    padding: 20px;
    color: var(--color-text-main);
    border: 1px solid var(--color-border);
    border-radius: 9px;

    &__switch {
      float: right;
    }

    &__workspace {
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 16px;
      letter-spacing: 0.2px;

      &-logo {
        margin-right: 11px;
      }
    }

    &__title {
    }

    &__info {
      display: flex;
      margin-top: 20px;

      &-section {
        margin-right: 30px;
      }

      &-bar {
        padding-top: 3px;
      }
    }

    &__current-plan {
      cursor: pointer;
    }

    &__label {
      @apply --ui-label;

      margin-bottom: 15px;
      margin-right: 13px;
      display: inline-block;
    }

    &__plan {
      display: flex;
      align-items: center;
      padding: 9px 15px;
      border: 1px solid var(--color-text-main);
      border-radius: 3px;
    }

    &__plan-name {
      margin-right: 10px;
      color: var(--color-text-main);
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
      letter-spacing: 0.19px;
    }

    &__plan-coast {
      color: var(--color-text-second);
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
      letter-spacing: 0.19px;
    }

    &__events {
      color: var(--color-text-main);
      font-weight: bold;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0.18px;
    }

    &__volume-progress {
      width: 160px;
      height: 5px;
      margin-top: 7px;
      background-color: var(--color-volume-progress-bg);
    }

    &__buttons {
      margin-top: 25px;

      .ui-button {
        margin-right: 20px;
      }
    }

    &__workspace-blocked {
      width: 62px;
      height: 23px;
      margin-left: 15px;
      padding: 5px 7px;
      border-radius: 6px;
      border: solid 1px rgba(217, 72, 72, 0.2);
      background-color: rgba(217, 72, 72, 0.21);
      font-family: Roboto;
      font-size: 13px;
      line-height: 1;
      letter-spacing: 0.16px;
      text-align: center;
      color: var(--color-indicator-critical);
    }

    &__attention {
      width: 18px;
      height: 18px;
      padding: 1px 7px;
      background-color: var(--color-indicator-critical);
      display: inline-block;
      border-radius: 50%;

      &__mark {
        width: 2px;
        height: 10px;
        color: var(--color-attention-mark)
      }
    }

    &__volume-boost {
      width: 65px;
      height: 23px;
      padding: 4px 8px 4px 10px;
      border-radius: 12.5px;
      border: solid 1px var(--color-volume-boost-border);
      display: inline;
      font-family: Roboto;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.16px;
      color: var(--color-volume-boost-border);
      background: var(--color-bg-main);
    }

    &__autopay-is-on {
      width: 350px;
      height: 14px;
      margin: 20px 166px 0 0;
      font-family: Roboto;
      font-size: 12px;
      letter-spacing: 0.15px;
      color: var(--color-autopay-is-on-text)
    }

    &__mock {
      margin-top: 3px;
    }
  }

</style>
