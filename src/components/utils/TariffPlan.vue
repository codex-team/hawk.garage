<template>
  <div
    class="tariff-plan"
    :class="{'tariff-plan--selected': selected}"
  >
    <h4 class="tariff-plan__name">
      {{ name }}
    </h4>
    <div class="tariff-plan__limit">
      {{ limit | spacedNumber }} {{ $t('common.eventsPerMonth') }}
    </div>
    <div class="tariff-plan__footer">
      <div class="tariff-plan__price">
        {{ price === 0 ? $t('common.free') : `${$options.filters.spacedNumber(price)}${$t('common.dollarsPerMonth')}` }}
      </div>
      <UiButton
        small
        submit
        rounded
        :content="$t('common.select')"
        class="tariff-plan__button"
      />
    </div>
  </div>
</template>

<script>
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
     * Is plan card selected
     */
    selected: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
  .tariff-plan {
    box-sizing: border-box;
    width: 220px;
    padding: 20px 25px;
    border-radius: 7px;
    background: var(--color-bg-main);
    cursor: pointer;

    &--selected {
      padding: 17px 22px;
      border: 3px solid var(--color-indicator-medium);
    }

    &__name {
      margin: 0 0 10px;

      font-size: 15px;
      letter-spacing: 0;
      font-weight: 600;
      color: var(--color-text-main);
    }

    &__limit {
      font-size: 15px;
      letter-spacing: 0;
      font-weight: 600;
      color: var(--color-text-second);
    }

    &__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 30px 0 0;
    }

    &__price {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-text-second);
    }

    &__button {
      .ui-button-text {
        font-size: 11px;
        font-weight: 600;
        line-height: 13px;
        letter-spacing: 0.14px;
        text-transform: uppercase;
      }
    }
  }
</style>
