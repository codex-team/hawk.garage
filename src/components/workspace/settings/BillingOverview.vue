<template>
  <div class="billing-card">
    <UiSwitch
      v-if="!isFreePlan"
      class="billing-card__switch"
      :label="$t('billing.autoPay')"
      :value="isAutoPayOn"
      @input="onAutoPayInput"
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
      <div class="billing-card__workspace-name">
        {{ workspace.name }}
      </div>
      <StatusBlock
        v-if="isBLocked"
        :content="$t('billing.blocked')"
        bad
      />
    </div>

    <div class="billing-card__info">
      <!-- Plan -->
      <div class="billing-card__info-section">
        <div class="billing-card__label">
          {{ $t('billing.currentPlan') }}
          <Icon
            v-if="isEventsLimitExceeded"
            class="billing-card__attention"
            symbol="attention-sign"
          />
        </div>
        <div
          class="billing-card__plan"
        >
          <div class="billing-card__plan-name">
            {{ plan.name || 'Free' }}
          </div>
          <div class="billing-card__plan-coast">
            {{ plan.monthlyCharge || 0 }}{{ planCurrencySign }}/{{ $t('billing.payPeriod') }}
          </div>
        </div>
      </div>

      <!-- Valid till -->
      <div
        v-if="plan.monthlyCharge"
        class="billing-card__info-section"
      >
        <div
          class="billing-card__label"
        >
          {{ $t('billing.validTill') }}
        </div>
        <div
          class="billing-card__info-bar"
        >
          <div class="billing-card__events">
            {{ validTillText }}
          </div>
          <Progress
            :max="progressMaxDate"
            :current="progressCurrentDate"
            :color="isAutoPayOn ? 'rgba(219, 230, 255, 0.6)' : (progressCurrentDate / progressMaxDate) > 0.8 ? '#d94848' : 'rgba(219, 230, 255, 0.6)'"
            class="billing-card__volume-progress"
          />
        </div>
      </div>

      <!-- Volume -->
      <div class="billing-card__info-section">
        <div class="billing-card__label">
          {{ $t('billing.volume') }}

          <!-- <PositiveButton
            v-if="isEventsLimitExceeded"
            :content="$t('billing.boost')"
          /> -->
        </div>
        <div class="billing-card__info-bar">
          <div class="billing-card__events">
            {{ volumeEventsText }}
          </div>
          <ProgressBar
            :max="plan.eventsLimit || 0"
            :current="eventsCount"
            :color="(eventsCount / (plan.eventsLimit || eventsCount)) > 0.8 ? '#d94848' : 'rgba(219, 230, 255, 0.6)'"
            class="billing-card__volume-progress"
          />
        </div>
      </div>
    </div>
    <div class="billing-card__buttons">
      <UiButton
        v-for="(button, index) in buttons"
        :key="'button:' + index"
        :submit="index === 0"
        :secondary="index !== 0"
        :content="button.label"
        class="billing-card__buttons--default"
        @click="button.onClick"
      />
    </div>
    <div
      v-if="!isFreePlan && isAutoPayOn"
      class="billing-card__autopay-is-on"
    >
      {{ autoPayIsOnText }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EntityImage from '../../utils/EntityImage.vue';
import ProgressBar from '../../utils/Progress.vue';
import UiSwitch from '../../forms/UiSwitch.vue';
import StatusBlock from '../../utils/StatusBlock.vue';
import { SET_MODAL_DIALOG } from '../../../store/modules/modalDialog/actionTypes';
import UiButton from './../../utils/UiButton.vue';
import Icon from '../../utils/Icon.vue';
import { Plan } from '../../../types/plan';
import { Button } from '../../../types/button';
// import PositiveButton from '../../utils/PostivieButton.vue';
import notifier from 'codex-notifier';
import { CANCEL_SUBSCRIPTION } from '../../../store/modules/workspaces/actionTypes';
import { FETCH_PLANS } from '../../../store/modules/plans/actionTypes';
import { getCurrencySign } from '@/utils';
import { ActionType } from '@/components/utils/ConfirmationWindow/types';
import { prettyDateFromDateTimeString, spacedNumber } from '@/utils/filters';

export default defineComponent({
  name: 'BillingOverview',
  components: {
    UiSwitch,
    ProgressBar,
    EntityImage,
    UiButton,
    StatusBlock,
    Icon,
    // PositiveButton,
  },
  props: {
    workspace: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      /**
       * `Increment Event Limit` button
       */
      incrementEventsLimit: {
        label: this.$i18n.t('billing.buttons.incrementEventsLimit') as string,
        onClick: () => {
          this.$store.dispatch(SET_MODAL_DIALOG, {
            component: 'ChooseTariffPlanPopup',
            data: {
              workspaceId: this.workspace.id,
            },
          });
        },
      },
      /**
       * `Enable Auto Payment` button
       */
      enableAutoPayment: {
        label: this.$i18n.t('billing.buttons.enableAutoPayment') as string,
        onClick: () => {
          this.$store.dispatch(SET_MODAL_DIALOG, {
            component: 'PaymentDetailsDialog',
            data: {
              workspaceId: this.workspace.id,
              tariffPlanId: this.workspace.plan.id,
              isRecurrent: true,
            },
          });
        },
      },
      /**
       * `Prolongate Current Plan` button
       */
      prolongateCurrentPlan: {
        label: this.$i18n.t('billing.buttons.prolongateCurrentPlan') as string,
        onClick: () => {
          this.$store.dispatch(SET_MODAL_DIALOG, {
            component: 'PaymentDetailsDialog',
            data: {
              workspaceId: this.workspace.id,
              tariffPlanId: this.workspace.plan.id,
              isRecurrent: true,
            },
          });
        },
      },
      /**
       * The current date
       */
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
     * Minimal plan price
     */
    minPlanPrice(): number {
      const plans = this.$store.state.plans.list;
      const plansPrices = plans.map(plan => plan.monthlyCharge).filter(price => price !== 0);

      return Math.min(...plansPrices);
    },
    /**
     * `Increment Event Limit from` button
     */
    incrementEventsLimitWithPrice(): Omit<Button, 'style'> {
      return {
        label: this.$i18n.t('billing.buttons.incrementEventsLimitWithPrice', {
          price: this.minPlanPrice + ' ' + this.planCurrencySign,
        }) as string,
        onClick: () => {
          this.$store.dispatch(SET_MODAL_DIALOG, {
            component: 'ChooseTariffPlanPopup',
            data: {
              workspaceId: this.workspace.id,
            },
          });
        },
      };
    },
    /**
     * Return currency sign depending on plan currency
     */
    planCurrencySign(): string {
      return getCurrencySign(this.plan.monthlyChargeCurrency);
    },
    /**
     * Total number of errors since the last charge date
     */
    eventsCount(): number {
      return this.workspace.billingPeriodEventsCount || 0;
    },
    /**
     * Returns buttons list depended on workspace state
     */
    buttons(): Omit<Button, 'style'>[] {
      if (this.isFreePlan) {
        return [this.incrementEventsLimitWithPrice];
      }

      if (this.isBLocked) {
        return [
          this.incrementEventsLimit,
          this.prolongateCurrentPlan,
        ];
      }

      if (this.isSubExpired) {
        return [
          this.prolongateCurrentPlan,
          this.incrementEventsLimit,
        ];
      }

      if (!this.isAutoPayOn) {
        return [
          this.enableAutoPayment,
          this.incrementEventsLimit,
        ];
      }

      if (this.isAutoPayOn) {
        return [this.incrementEventsLimit];
      }

      return [];
    },
    /**
     * Checking the volume spent
     */
    isEventsLimitExceeded(): boolean {
      return this.plan.eventsLimit <= this.workspace.billingPeriodEventsCount;
    },
    /**
     * Checking the subscription expiration
     */
    isSubExpired(): boolean {
      return this.subExpiredDate < this.now;
    },
    /**
     * Return subscription expiration date
     */
    subExpiredDate(): Date {
      if (this.workspace.paidUntil) {
        return new Date(this.workspace.paidUntil);
      }

      const expiredDate = new Date(this.workspace.lastChargeDate);

      if (this.workspace.isDebug) {
        expiredDate.setDate(expiredDate.getDate() + 1);
      } else {
        expiredDate.setMonth(expiredDate.getMonth() + 1);
      }

      return expiredDate;
    },
    /**
     * Return the date in ms from sub created date to sub last date
     */
    progressMaxDate(): number {
      return this.diffDates(this.subExpiredDate, this.workspace.lastChargeDate);
    },
    /**
     * Return the date in ms from sub created date to current date
     */
    progressCurrentDate(): number {
      return this.diffDates(this.now, this.workspace.lastChargeDate);
    },
    /**
     * Return true if workspace have subscription
     */
    isAutoPayOn(): boolean {
      return !!this.workspace.subscriptionId;
    },

    /**
     * Return true if workspace plan is `Startup`
     */
    isFreePlan(): boolean {
      return this.plan.id === import.meta.env.VITE_FREE_PLAN_ID;
    },

    /**
     * Return true if workspaces is blocked
     */
    isBLocked(): boolean {
      return this.workspace.isBlocked;
    },

    /**
     * Return formatted text for valid till section
     */
    validTillText(): string {
      const expiredText = this.isSubExpired && !this.isAutoPayOn ? this.$t('billing.expired') : '';
      const dateText = prettyDateFromDateTimeString(this.subExpiredDate.toISOString());

      return `${expiredText} ${dateText}`.trim();
    },

    /**
     * Return formatted text for auto pay is on section
     */
    autoPayIsOnText(): string {
      const autoPayText = this.$t('billing.autoPayIsOn');
      const dateText = prettyDateFromDateTimeString(this.subExpiredDate.toISOString());

      return `${autoPayText} ${dateText}`;
    },

    /**
     * Return formatted text for volume events section
     */
    volumeEventsText(): string {
      const currentEvents = spacedNumber(this.eventsCount || 0);
      const limitEvents = spacedNumber(this.plan.eventsLimit || 0);
      const eventsText = this.$t('billing.volumeEvents', { count: this.eventsCount });

      return `${currentEvents} / ${limitEvents} ${eventsText}`;
    },
  },
  /**
   * Fetch available plans before component is created
   */
  beforeCreate() {
    this.$store.dispatch(FETCH_PLANS);
  },
  mounted() {
    this.now = new Date();
  },
  methods: {
    /**
     * Open ChooseTariffPlan popup on click on the current plan button
     */
    openChooseTariffPlan(): void {
      this.$store.dispatch(SET_MODAL_DIALOG, {
        component: 'ChooseTariffPlanPopup',
        data: {
          workspaceId: this.workspace.id,
        },
      });
    },

    /**
     * Difference between dates
     *
     * @param dateString1 - first date
     * @param dateString2 - second date
     */
    diffDates(dateString1: Date, dateString2: Date): number {
      const date1 = new Date(dateString1);
      const date2 = new Date(dateString2);

      return Math.abs(date1.getTime() - date2.getTime());
    },

    /**
     * Performs subscription cancelling for current workspace
     */
    async cancelSubscription(): Promise<void> {
      try {
        await this.$store.dispatch(CANCEL_SUBSCRIPTION, {
          workspaceId: this.workspace.id,
        });

        notifier.show({
          message: this.$i18n.t('billing.autoProlongation.cancelSuccessMessage') as string,
          style: 'success',
          time: 5000,
        });
      } catch {
        notifier.show({
          message: this.$i18n.t('billing.autoProlongation.cancelErrorMessage') as string,
          style: 'error',
          time: 5000,
        });
      }
    },

    /**
     * Handler for auto-pay input
     * Initiates payment dialog for subscribing
     *
     * @param value - new value
     */
    async onAutoPayInput(value): Promise<void> {
      if (!value) {
        this.$confirm.open({
          actionType: ActionType.SUBMIT,
          description: this.$i18n.t('workspaces.settings.billing.cancelSubscriptionText').toString(),
          onConfirm: async () => {
            await this.cancelSubscription();
          },
        });

        return;
      }

      this.$store.dispatch(SET_MODAL_DIALOG, {
        component: 'PaymentDetailsDialog',
        data: {
          tariffPlanId: this.workspace.plan.id,
          workspaceId: this.workspace.id,
          isRecurrent: true,
        },
      });
    },
  },
});
</script>

<style lang="postcss">
  @import url('./../../../styles/custom-properties.css');

  .billing-card {
    width: fit-content;
    min-width: var(--width-popup-form-container);
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

    &__info {
      display: flex;
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

    &__current-plan {
      cursor: pointer;
    }

    &__label {
      @mixin ui-label;
      display: inline-block;
      margin-right: 13px;
      margin-bottom: 15px;
    }

    &__plan {
      display: flex;
      align-items: center;
      padding-top: 3px;
      font-size: 14px;
      white-space: nowrap;
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
      white-space: nowrap;
    }

    &__volume-progress {
      width: 160px;
      height: 5px;
      margin-top: 7px;
      background-color: color-mod(var(--color-border-base) alpha(25%));
    }

    &__buttons {
      margin-top: 25px;

      &--default {
        margin-right: 20px;
      }
    }

    &__workspace-name {
      margin-right: 15px;
    }

    &__attention {
      width: 18px;
      height: 18px;
      margin-top: -12px;
      margin-bottom: -5px;
      margin-left: 5px;
    }

    &__volume-boost {
      display: inline;
      width: 65px;
      height: 23px;
      padding: 2px 8px 8px 10px;
      color: var(--color-indicator-positive);
      font-weight: 500;
      font-size: 13px;
      letter-spacing: 0.16px;
      background: var(--color-bg-main);
      border: solid 1px var(--color-indicator-positive);
      border-radius: 12.5px;
    }

    &__autopay-is-on {
      height: 14px;
      margin: 20px 166px 0 0;
      color: color-mod(var(--color-border-base) alpha(60%));
      font-size: 12px;
      letter-spacing: 0.15px;
    }

    &__mock {
      margin-top: 3px;
    }
  }

</style>
