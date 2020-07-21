<template>
  <div class="bank-card clearfix">
    <Icon
      class="bank-card__icon"
      symbol="credit-card"
    />
    <div class="bank-card__number">
      {{ card.name }}
    </div>
    <div class="bank-card__detach-button">
      {{ $t('billing.detachCard') }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '../Icon.vue';
import { BankCard } from '@/types/bank-card';

export default Vue.extend({
  name: 'BankCard',
  components: {
    Icon,
  },
  props: {
    card: {
      type: Object as () => BankCard,
      required: true,
    },
  },
});
</script>

<style>
  .bank-card {
    width: 200px;
    margin-right: 45px;
    margin-bottom: 15px;

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
  }
</style>
