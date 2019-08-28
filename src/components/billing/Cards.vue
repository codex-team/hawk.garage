<template>
  <div class="billing-cards">
    <label class="label">{{ $t('billing.connectedCards') }}</label>
    <div class="billing-cards__list">
      <div
        v-for="card in cards"
        :key="card.number"
        class="billing-cards__card clearfix"
      >
        <Icon
          class="billing-cards__icon"
          symbol="credit-card"
        />
        <div class="billing-cards__number">
          {{ card.number }}
        </div>
        <div class="billing-cards__detach-button">
          {{ $t('billing.detachCard') }}
        </div>
      </div>
      <div class="billing-cards__add-button">
        <Icon
          class="billing-cards__plus-icon"
          symbol="plus"
        />
        <span class="billing-cards__add-button-label">
          {{ $t('billing.addCardButton') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../utils/Icon';
const cards = [
  {
    number: '**** **** **** 3123'
  },
  {
    number: '**** **** **** 3122'
  },
  {
    number: '**** **** **** 3121'
  }
];

export default {
  name: 'BillingCards',
  components: { Icon },
  data() {
    return {
      cards
    };
  }
};
</script>

<style>
  .billing-cards {
    width: 600px;

    &__list {
      display: flex;
      flex-flow: row wrap;
      margin: 15px 0 50px;
    }

    &__card {
      width: 200px;
      margin-right: 45px;
      margin-bottom: 15px;
    }

    &__icon {
      float: left;
      width: 60px;
      height:40px;
      margin-right: 10px;
    }

    &__number {
      margin: 6px 0 2px;
      color: var(--color-text-main);
      font-weight: bold;
      font-size: 12px;
      line-height: 14px;
      letter-spacing: 0.15px;
    }

    &__detach-button {
      color: var(--color-text-second);
      font-size: 10px;
      line-height: 11px;
      letter-spacing: 0.13px;
      text-transform: uppercase;
      cursor: pointer;
    }

    &__add-button {
      height: 42px;
      padding: 13px;
      border: 1px dashed var(--color-text-second);
      border-radius: 8px;
      cursor: pointer;
      user-select: none;
    }

    &__plus-icon {
      width: 16px;
      height: 16px;
      margin-right: 5px;
      margin-bottom: -3px;
      fill: var(--color-text-second);
    }

    &__add-button-label {
       color: var(--color-text-second);
       font-size: 12px;
       line-height: 14px;
       letter-spacing: 0.15px;
        text-transform: uppercase;
    }
  }
</style>
