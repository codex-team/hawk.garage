<template>
  <div class="workspace-billing-card">
    <CustomSwitch
      class="workspace-billing-card__switch"
      :label="$t('billing.autoPay')"
    />
    <div class="clearfix">
      <EntityImage
        :id="workspace.id"
        class="workspace-billing-card__image"
        :title="workspace.name"
        :name="workspace.name"
        :image="workspace.image"
      />
      <div class="workspace-billing-card__title">
        {{ workspace.name }}
      </div>
      <div class="workspace-billing-card__members-count">
        {{ $tc('billing.members', workspace.users ? workspace.users.length : 0) }}
      </div>
    </div>
    <div class="workspace-billing-card__info">
      <div class="workspace-billing-card__info-card">
        <div class="workspace-billing-card__label">
          {{ $t('billing.currentBalance') }}
        </div>
        <div class="billing-card__balance">
          {{ workspace.balance || 0 }} $
        </div>
      </div>
      <div class="workspace-billing-card__info-card">
        <div class="workspace-billing-card__label">
          {{ $t('billing.currentPlan') }}
        </div>
        <div class="workspace-billing-card__plan">
          <div class="workspace-billing-card__plan-name">
            {{ plan.name || 'Free' }}
          </div>
          <div class="workspace-billing-card__plan-coast">
            {{ plan.monthlyCharge || 0 }}$/{{ $t('billing.payPeriod') }}
          </div>
        </div>
      </div>
      <div class="workspace-billing-card__info-card">
        <div class="workspace-billing-card__label">
          {{ $t('billing.volume') }}
        </div>
        <div class="workspace-billing-card__volume">
          <div class="workspace-billing-card__events">
            {{ eventsCount | spacedNumber }} / {{ plan.eventsLimit || 0 | spacedNumber }} {{ $tc('billing.volumeEvents',
                                                                                                 eventsCount) }}
          </div>
          <Progress
            :max="plan.eventsLimit || 0"
            :current="eventsCount"
            :color="(eventsCount / (plan.eventsLimit || eventsCount)) > 0.8 ? '#d94848' : 'rgba(219, 230, 255, 0.6)'"
            class="workspace-billing-card__volume-progress"
          />
        </div>
      </div>
    </div>
    <div class="workspace-billing-card__buttons">
      <button
        class="button button--submit workspace-billing-card__button"
      >
        {{ $t('billing.pay') }} 100$
      </button>
      <button
        class="button button--submit workspace-billing-card__button"
      >
        {{ $t('billing.pay') }} 1000$
      </button>
      <button
        class="button button--submit workspace-billing-card__button"
      >
        {{ $t('billing.payCustomAmount') }}
      </button>
      <button class="button button--submit workspace-billing-card__button workspace-billing-card__button--invoice">
        <Icon
          class="workspace-billing-card__invoice-icon"
          symbol="invoice"
        />
        {{ $t('billing.requestInvoice') }}
      </button>
    </div>
  </div>
</template>

<script>
import EntityImage from '../utils/EntityImage';
import Progress from '../utils/Progress';
import Icon from '../utils/Icon';
import CustomSwitch from '../forms/Switch';

export default {
  name: 'WorkspaceBillingCard',
  components: { CustomSwitch, Icon, Progress, EntityImage },
  props: {
    workspace: {
      type: Object,
      required: true
    }
  },
  computed: {
    plan() {
      return this.workspace.plan || {};
    },
    eventsCount() {
      return 6789;
    }
  }
};
</script>

<style>
  .workspace-billing-card {
    width: 600px;
    margin-bottom: 20px;
    padding: 20px;
    color: var(--color-text-main);
    border: 1px solid rgba(219, 230, 255, 0.2);
    border-radius: 4px;

    &__switch {
      float: right;
    }

    &__image {
      float: left;
      width: 34px;
      height: 34px;
      margin-top: -1px;
      margin-right: 15px;
      line-height: 34px;
      border-radius: 3px;
    }

    &__title {
      font-weight: bold;
      font-size: 15px;
      line-height: 20px;
      letter-spacing: 0.19px;
    }

    &__members-count {
      color: var(--color-text-second);
      font-size: 12px;
      line-height: 14px;
      letter-spacing: 0.15px;
    }

    &__info {
      display: flex;
      margin-top: 20px;
    }

    &__info-card {
      margin-right: 40px;
    }

    &__label {
      margin-bottom: 15px;
      color: var(--color-text-second);
      font-weight: bold;
      font-size: 12px;
      letter-spacing: 0.15px;
      text-transform: uppercase;
    }

    &__balance {
      color: var(--color-text-main);
      font-weight: bold;
      font-size: 34px;
      line-height: 40px;
      letter-spacing: 0.43px;
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
    }

    &__button {
      margin-right: 15px;
      padding: 10px 12px;
      line-height: 17px;
    }

    &__button--invoice {
      background-color: #50638c;

      &:hover {
        background-color: #475980;
      }
    }

    &__invoice-icon {
      width: 12px;
      height: 13px;
      margin-right: 7px;
      margin-bottom: -2px;
    }
  }
</style>
