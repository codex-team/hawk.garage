<template>
  <div
    class="tariff-plan"
    :class="{
      'tariff-plan--selected': selected,
      'tariff-plan--horizontal': horizontal,
    }"
  >
    <h4 class="tariff-plan__name">
      {{ name }}
    </h4>
    <div class="tariff-plan__limit">
      {{ spacedNumber(limit) }} <span class="tariff-plan__limit-text">{{ $t('common.eventsPerMonth') }}</span>
    </div>
    <div class="tariff-plan__footer">
      <div class="tariff-plan__price">
        {{ price === 0 ? $t('common.free') : `${spacedNumber(price)}${$t('common.moneyPerMonth', { currency: currencySign })}` }}
      </div>

      <UiButton
        small
        submit
        rounded
        :content="isCurrentPlan ? $t('common.selected') : $t('common.select')"
        class="tariff-plan__button"
        :disabled="isCurrentPlan"
      />
    </div>
  </div>
</template>

<script>
import { getCurrencySign, spacedNumber } from '@/utils';
import UiButton from './UiButton';

export default {
  name: 'TariffPlan',
  components: {
    UiButton,
  },
  props: {
    /**
     * Name of the plan
     */
    name: {
      type: String,
      required: true,
    },
    /**
     * Plan events limit
     */
    limit: {
      type: Number,
      required: true,
    },
    /**
     * Plan price per month
     */
    price: {
      type: Number,
      required: true,
    },
    /**
     * Currency for price
     */
    currency: {
      type: String,
      required: true,
    },
    /**
     * Is plan selected
     */
    selected: {
      type: Boolean,
      default: false,
    },
    /**
     * True if horizontal view enabled
     */
    horizontal: {
      type: Boolean,
      default: false,
    },
    isCurrentPlan: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    currencySign() {
      return getCurrencySign(this.currency);
    },
  },
  methods: {
    spacedNumber,
  },
};
</script>

<style>
  .tariff-plan {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 220px;
    height: 140px;
    padding: 20px 25px;
    background: var(--color-bg-main);
    border-radius: 7px;
    cursor: pointer;

    &--selected {
      padding: 17px 22px;
      border: 3px solid var(--color-indicator-medium);
    }

    &--horizontal {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: auto;
      height: auto;

      &:not(:last-of-type) {
        margin-bottom: 10px;
      }

      .tariff-plan__name {
        width: 150px;
        margin-bottom: 0;
      }
      .tariff-plan__limit {
        width: 300px;
      }

      .tariff-plan__footer {
        margin-left: auto;
      }

      .tariff-plan__price {
        margin-right: 20px
      }
    }

    &__name {
      margin: 0 0 10px;
      color: var(--color-text-main);
      font-weight: 600;

      font-size: 15px;
      letter-spacing: 0;
    }

    &__limit {
      color: var(--color-text-second);
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0;
    }

    &__limit-text {
      white-space: nowrap;
    }

    &__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
    }

    &__price {
      color: var(--color-text-second);
      font-weight: 600;
      font-size: 13px;
    }

    &__button {
      .ui-button-text {
        font-weight: 600;
        font-size: 11px;
        line-height: 13px;
        letter-spacing: 0.14px;
        text-transform: uppercase;
      }
    }
  }
</style>
