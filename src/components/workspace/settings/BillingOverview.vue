<template>
  <div class="billing-card">
    <UiSwitch
      class="billing-card__switch"
      :label="$t('billing.autoPay')"
    />
    <div class="clearfix billing-card__workspace">
      <EntityImage
        :id="workspace.id"
        class="billing-card__workspace-logo"
        :title="workspace.name"
        :name="workspace.name"
        :image="workspace.image"
        size="27"
      />
      {{ workspace.name }}
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

      <!-- Vaolume -->




    </div>
    <div class="billing-card__buttons">
      <UiButton
        v-for="(button, index) in buttons"
        :key="'button:' + index"
        :submit="button.style === 'primary'"
        @click="button.onClick"
        :content="button.label"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import EntityImage from '../../utils/EntityImage.vue';
import Progress from '../../utils/Progress.vue';
import Icon from '../../utils/Icon.vue';
import UiSwitch from '../../forms/UiSwitch.vue';
import { SET_MODAL_DIALOG } from '../../../store/modules/modalDialog/actionTypes';
import UiButton from './../../utils/UiButton.vue';

export default Vue.extend({
  name: 'BillingOverview',
  components: {
    UiSwitch,
    Icon,
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
  computed: {
    plan() {
      return this.workspace.plan || {};
    },
    /**
     * Total number of errors since the last charge date
     */
    eventsCount() {
      return this.workspace.billingPeriodEventsCount || 0;
    },

    buttons(){
      return [
        {
          label: this.$i18n.t('Increment events limit'),
          style: 'primary',
          onClick: () => {
            console.log('Increment events limit');
          }
        },
        {
          label: this.$i18n.t('Enable auto payment'),
          style: 'primary',
          onClick: () => {
            console.log('Enable auto payment');
          }
        },
        {
          label: this.$i18n.t('Prolongate current plan'),
          style: 'secondary',
          onClick: () => {
            console.log('Prolongate current plan');
          }
        },
      ]
    },
  },
  methods: {
    processPayment(amount) {
      this.$store.dispatch(SET_MODAL_DIALOG, {
        component: 'ProcessPaymentDialog',
        data: { amount },
      });
    },
    /**
     * Open ChooseTariffPlan popup on click on the current plan button
     */
    onPlanClick() {
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
  }
</style>
