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
            disabled
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
import { Vue } from 'vue-property-decorator';
import { Workspace } from '@/types/workspaces';
import { PlanProlongationPayload } from '@/types/plan-prolongation-payload';
import axios from 'axios';
import { BeforePaymentPayload } from '../../types/before-payment-payload';
import { API_ENDPOINT } from '../../api';

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

export default Vue.extend({
  name: 'ProcessPaymentDialog',
  components: {
    PopupDialog,
    CustomSelect,
  },
  props: {
    /**
     * Tariff plan id to pay for
     */
    tariffPlanId: {
      type: String,
      required: true,
    },
    /**
     * Workspace id to pay for
     */
    workspaceId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      workspace: this.$store.getters.getWorkspaceById(this.workspaceId),
      card: cards[0],
    };
  },
  computed: {
    /**
     * Card list for testing
     */
    cards() {
      return cards;
    },

    /**
     * Workspaces list
     */
    workspaces(): Workspace[] {
      return this.$store.state.workspaces.list;
    },
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
  methods: {
    /**
     * Method for payment processing
     */
    async processPayment() {
      const response = await axios.get(
        `${API_ENDPOINT}/billing/compose-payment?workspaceId=${this.workspace.id}&tariffPlanId=${this.tariffPlanId}`
      );

      return this.showPaymentWidget(response.data as BeforePaymentPayload);
    },

    /**
     * Method prepares widget and charges money from entered card
     *
     * @param {BeforePaymentPayload} data — server response that sent after beforePay request
     */
    async showPaymentWidget(data: BeforePaymentPayload) {
      const language = this.$store.state.app.language.toUpperCase();

      const widget = new window.cp.CloudPayments();

      const paymentData: PlanProlongationPayload = {
        checksum: data.checksum,
      };

      widget.pay('charge',
        {
          publicId: process.env.VUE_APP_CLOUDPAYMENTS_PUBLIC_ID,
          /**
           * @todo add i18n message
           */
          description: `Payment for tariff "${data.plan.name}" for ${this.workspace.name.toString()} workspace for a month`,
          amount: +data.plan.monthlyCharge,
          currency: data.currency,

          /** Label for admin panel */
          invoiceId: data.invoiceId,

          skin: 'mini',
          data: paymentData,
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
    },
  },
});

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
