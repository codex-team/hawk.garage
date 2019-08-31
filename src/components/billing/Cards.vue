<template>
  <div class="billing-cards">
    <label class="label">{{ $t('billing.connectedCards') }}</label>
    <div class="billing-cards__list">
      <div
        v-for="card in cards"
        :key="card.id"
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
        {{ $t('billing.addCardButton') }}
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../utils/Icon';
export const cards = [
  {
    id: '1',
    number: '**** **** **** 3123',
    name: '**** **** **** 3123'
  },
  {
    id: '2',
    number: '**** **** **** 3122',
    name: '**** **** **** 3122'
  },
  {
    id: '3',
    number: '**** **** **** 3121',
    name: '**** **** **** 3121'
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

      &:hover {
        color: var(--color-text-main);
      }
    }

    &__add-button {
      height: 40px;
      padding: 0 13px;
      color: var(--color-text-second);
      font-size: 12px;
      line-height: 40px;
      letter-spacing: 0.15px;
      text-transform: uppercase;
      border: 1px dashed var(--color-text-second);
      border-radius: 8px;
      cursor: pointer;
      user-select: none;
      fill: var(--color-text-second);

      &:hover {
        color: var(--color-text-main);
        border-color: var(--color-text-main);
        fill: var(--color-text-main);
      }
    }

    &__plus-icon {
      width: 16px;
      height: 16px;
      margin-right: 5px;
      margin-bottom: -3px;
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
