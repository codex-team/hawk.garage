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
import * as billingApi from '../../api/billing';
import { Vue, Component } from 'vue-property-decorator';
import { Workspace } from '@/types/workspaces';

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
    if (window.cp && window.cp.CloudPayments) return;

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
  async processPayment(): Promise<void> {
    const language = this.$store.state.app.language.toUpperCase();

    const widget = new window.cp.CloudPayments({
      language: "en-US"
    });

    const workspaceId = this.workspace.id;
    const amount = +this.amount;

    widget.pay('auth', // или 'charge'
      { //options
        publicId: 'test_api_00000000000000000000001', //id из личного кабинета
        description: `Add funds for ${this.workspace.name.toString()} workspace`, //назначение
        amount: this.amount, //сумма
        currency: 'USD', //валюта
        // invoiceId: '1234567', //номер заказа  (необязательно)
        skin: "mini", //дизайн виджета (необязательно)
        data: {
          workspaceId,
        }
      },
      {
        onSuccess: async function (options) {
          console.info('onSuccess', options)

          const { paymentURL } = await billingApi.getPaymentLink({
            workspaceId: workspaceId,
            amount: +amount,
            language,
          });

          window.location.replace(window.location);
        },
        onFail: function (reason, options) {
          console.info('onFail', reason, options)
        },
        onComplete: function (paymentResult, options) {
          //Вызывается как только виджет получает от api.cloudpayments ответ с результатом транзакции.
          //например вызов вашей аналитики Facebook Pixel
          console.info('onComplete', paymentResult, options)
        }
      }
    )
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
