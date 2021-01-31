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

<script lang="ts">
import PopupDialog from '../utils/PopupDialog.vue';
import CustomSelect from '../forms/CustomSelect.vue';
import notifier from 'codex-notifier';
import { Vue, Component } from 'vue-property-decorator';
import { Workspace } from '@/types/workspaces';
import { CloudpaymentsData } from '@/types/cloudpayments-data';

const cards = [
  {
    id: '1',
    number: '**** **** **** 3123',
    name: '**** **** **** 3123',
  },
  {
    id: '2',
    number: '**** **** **** 3122',
    name: '**** **** **** 3122',
  },
  {
    id: '3',
    number: '**** **** **** 3121',
    name: '**** **** **** 3121',
  },
];

@Component({
  name: 'ProcessPaymentDialog',
  components: {
    PopupDialog,
    CustomSelect,
  },
  mounted() {
    /**
     * Check if script was loaded
     */
    if (window.cp && window.cp.CloudPayments) {
      return;
    }

    /**
     * Script is not loaded
     * Then create a new script tag and it to the head
     */
    const widgetScript = document.createElement('script');

    widgetScript.setAttribute('src', 'https://widget.cloudpayments.ru/bundles/cloudpayments');
    document.head.appendChild(widgetScript);
  },
})
/**
 * Dialog for payment
 */
export default class ProcessPaymentDialog extends Vue {
  /**
   * Workspace to pay for
   */
  private workspace: Workspace;

  /**
   * Card to pay from
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  private card: object;

  /**
   * Amount of money to pay
   */
  private amount: number;

  /**
   * Component constructor for data initialization
   */
  constructor() {
    super();
    this.workspace = this.$store.state.workspaces.current || this.$store.state.workspaces.list[0];
    this.card = cards[0];
    this.amount = this.$store.state.modalDialog.data.amount;
  }

  /**
   * Method for payment processing
   */
  processPayment() {
    const language = this.$store.state.app.language.toUpperCase();

    const widget = new window.cp.CloudPayments({
      language: 'en-US',
    });

    /**
     * @todo get tariff name
     */
    const tariff = 'base';

    widget.pay('charge',
      {
        publicId: process.env.VUE_APP_CLOUDPAYMENTS_PUBLIC_ID,
        description: `Activate tariff "${tariff}" for ${this.workspace.name.toString()} workspace for a month`,
        amount: +this.amount,
        currency: 'USD',

        /** Label for admin panel */
        invoiceId: `${this.workspace.name.toString()}`,

        skin: 'mini',
        data: {
          workspaceId: this.workspace.id,
        } as CloudpaymentsData,
      },
      {
        onSuccess: (options) => {
          console.info('onSuccess', options);

          notifier.show({
            message: this.$i18n.t('billing.widget.notifications.success') as string,
            style: 'success',
          });
        },
        onFail: (reason, options) => {
          console.info('onFail', reason, options);

          notifier.show({
            message: this.$i18n.t('billing.widget.notifications.error') as string,
            style: 'error',
          });
        },
        onComplete: (paymentResult, options) => {
          console.info('onComplete', paymentResult, options);
        },
      }
    );
  }

  /**
   * Card list for testing
   */
  get cards() {
    return cards;
  }

  /**
   * Workspaces list
   */
  get workspaces(): Workspace[] {
    return this.$store.state.workspaces.list;
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
