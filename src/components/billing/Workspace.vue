<template>
  <div class="billing-card">
    <CustomSwitch
      class="billing-card__switch"
      :label="$t('billing.autoPay')"
    />
    <div class="clearfix">
      <EntityImage
        :id="workspace.id"
        class="billing-card__logo"
        :title="workspace.name"
        :name="workspace.name"
        :image="workspace.image"
      />
      <div class="billing-card__title">
        {{ workspace.name }}
      </div>
      <div class="billing-card__members-count">
        2 {{ $t('billing.members') }}
      </div>
    </div>
    <div class="billing-card__info">
      <div class="billing-card__info-card">
        <div class="billing-card__label">
          {{ $t('billing.currentBalance') }}
        </div>
        <div class="billing-card__balance">
          200 $
        </div>
      </div>
      <div class="billing-card__info-card">
        <div class="billing-card__label">
          {{ $t('billing.currentPlan') }}
        </div>
        <div class="billing-card__plan">
          <div class="billing-card__plan-name">
            Basic
          </div>
          <div class="billing-card__plan-coast">
            100$/mo
          </div>
        </div>
      </div>
      <div class="billing-card__info-card">
        <div class="billing-card__label">
          {{ $t('billing.volume') }}
        </div>
        <div class="billing-card__volume">
          <div class="billing-card__events">
            83 432 / 100 000 {{ $t('billing.volumeEvents') }}
          </div>
          <Progress
            :max="100000"
            :current="83432"
            :color="83432/100000 > 0.8 ? '#d94848' : 'rgba(219, 230, 255, 0.6)'"
            class="billing-card__volume-progress"
          />
        </div>
      </div>
    </div>
    <div class="billing-card__buttons">
      <button
        class="button button--submit billing-card__button"
        @click="processPayment(100)"
      >
        {{ $t('billing.pay') }} 100$
      </button>
      <button
        class="button button--submit billing-card__button"
        @click="processPayment(1000)"
      >
        {{ $t('billing.pay') }} 1000$
      </button>
      <button
        class="button button--submit billing-card__button"
        @click="processPayment()"
      >
        {{ $t('billing.payCustomAmount') }}
      </button>
      <button class="button button--submit billing-card__button billing-card__button--invoice">
        <Icon
          class="billing-card__invoice-icon"
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
import { SET_MODAL_DIALOG } from '../../store/modules/modelDialog/actionTypes';

export default {
  name: 'BillingCard',
  components: { CustomSwitch, Icon, Progress, EntityImage },
  props: {
    workspace: {
      type: Object,
      required: true
    }
  },
  methods: {
    processPayment(amount) {
      this.$store.dispatch(SET_MODAL_DIALOG, { component: 'ProcessPaymentDialog', data: { amount } });
    }
  }
};
</script>

<style>
  .billing-card {
    width: 600px;
    margin-bottom: 20px;
    padding: 20px;
    color: var(--color-text-main);
    border: 1px solid var(--color-border);
    border-radius: 4px;

    &__switch {
      float: right;
    }

    &__logo {
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
      background-color: var(--color-indicator-low);

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
