<template>
  <PopupDialog @close="$emit('close')">
    <div class="payment-popup">
      <h1 class="payment-popup__header">
        {{ $t('billing.processPayment.header') }}
      </h1>
      <div class="payment-popup__description">
        {{ $t('billing.processPayment.description') }}
      </div>
      <form
        class="payment-popup__form"
        @submit.prevent="processPayment"
      >
        <CustomSelect
          v-model="workspace"
          class="payment-popup__select-workspace"
          :options="workspaces"
          :label="$t('billing.processPayment.workspaceSelectLabel')"
        />
        <CustomSelect
          v-model="card"
          class="payment-popup__select-card"
          :need-image="false"
          :options="cards"
          :label="$t('billing.processPayment.cardSelectLabel')"
        />
        <label class="label payment-popup__amount">
          {{ $t('billing.processPayment.amountLabel') }}
          <input
            v-model="amount"
            class="input payment-popup__amount-input"
          >
          <span class="payment-popup__dollar-sign">$</span>
        </label>
        <input
          class="button button--submit payment-popup__submit"
          type="submit"
          :value="$t('billing.processPayment.submitButton')"
        >
      </form>
    </div>
  </PopupDialog>
</template>

<script>
import PopupDialog from '../utils/PopupDialog';
import CustomSelect from '../forms/CustomSelect';
import { cards } from '../billing/Cards';
import { mapState } from 'vuex';

export default {
  name: 'ProcessPaymentDialog',
  components: { PopupDialog, CustomSelect },
  data() {
    return {
      workspace: this.$store.state.workspaces.current || this.$store.state.workspaces.list[0],
      card: cards[0],
      amount: this.$store.state.modalDialog.data.amount
    };
  },
  computed: {
    ...mapState({
      workspaces: state => state.workspaces.list,
    }),
    cards() {
      return cards;
    }
  },
  methods: {
    processPayment() {
      this.$emit('close');
    }
  }
};
</script>

<style>
  .payment-popup {
    max-width: 500px;
    padding: 30px;

    &__header {
      margin: 0;
      font-weight: bold;
      font-size: 18px;
    }

    &__description {
      max-width: 363px;
      margin-top: 20px;
      color: var(--color-text-second);
      font-size: 14px;
      line-height: 1.43;
    }

    &__select-workspace, &__select-card {
      width: 280px;
      margin-top: 25px;
    }

    &__amount {
      position: relative;
      width: 280px;
      margin: 25px 2px 0;
    }

    &__amount-input {
      margin-top: 9px;
    }

    &__dollar-sign {
      position: absolute;
      right: 10px;
      bottom: 10px;
      color: var(--color-text-main);
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
    }

    &__submit {
      margin-top: 25px;
      padding: 12px 45px;
    }
  }

</style>
