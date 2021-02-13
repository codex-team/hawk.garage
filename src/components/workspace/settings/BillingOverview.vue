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
        v-if="isVolumeSpent()"
        class="billing-card__workspace-blocked"
      >
        <div class="billing-card__workspace-blocked__text">
          {{ $t('workspaces.settings.workspace.blocked') }}
        </div>
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
        <div class="billing-card__info-bar">
          <div class="billing-card__events">
            {{ workspace.validTill | prettyDateFromDateTimeString }}
          </div>
          <Progress
            :max="workspace.validTill | prettyDateFromDateTimeString"
            :current="Date.now() | prettyDateFromDateTimeString"
            :color="Date.now() / (workspace.validTill ) > 0.8 ? '#d94848' : 'rgba(219, 230, 255, 0.6)'"
            class="billing-card__volume-progress"
          />
        </div>
      </section>

      <!-- Volume -->
      <section class="billing-card__info-section">
        <div class="billing-card__label">
          {{ $t('billing.volume') }}
        </div>
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

interface Buttons {
  label: string;
  style: string;
  onClick: () => void
}

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
    buttons(): Buttons[] {
      if (this.workspace.plan.name === 'Free') {
        return [ this.incrementEventsLimit ];
      }

      if (!this.workspace.autoPlan) {
        if (this.isVolumeSpent) {
          return [ this.incrementEventsLimit ];
        }

        if (this.isSubExpired) {
          return [ this.prolongateCurrentPlan ];
        }

        return [ this.enableAutoPayment ];
      }

      return [];
    },
    isBlocked(): boolean {
      if (this.workspace.plan === 'Free') {
        return this.workspace.plan.eventsLimit === this.workspace.billingPeriodEventsCount;
      }

      return false;
    },
    isVolumeSpent(): boolean {
      return this.workspace.plan.eventsLimit === this.workspace.billingPeriodEventsCount;
    },
    isSubExpired(): boolean {
      const now = new Date(Date.now());
      const validTill = new Date(this.workspace.validTill);

      console.log('Now', now.toDateString());
      console.log('Valid Till', validTill.toDateString());

      return validTill < now;
    },
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
      background-color: rgba(219, 230, 255, 0.25);
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

      &__text {
        width: 48px;
        height: 13px;
        font-family: Roboto;
        font-size: 13px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: 0.16px;
        text-align: center;
        color: var(--color-indicator-critical);
      }
    }

    &__volume-boost {
      width: 65px;
      height: 23px;
      margin: 0 39px 13px 10px;
      margin-left: 13px;
      padding: 4px 8px 4px 10px;
      border-radius: 12.5px;
      border: solid 1px #2ccf6c;

      &__text {
        width: 47px;
        height: 15px;
        font-family: Roboto;
        font-size: 13px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: 0.16px;
        color: #2ccf6c;
      }
    }
  }

</style>
