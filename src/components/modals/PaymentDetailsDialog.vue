<template>
  <PopupDialog @close="$emit('close')">
    <div class="payment-details">
      <div class="payment-details__header">
        {{
          isRecurrent
            ? $t('billing.autoProlongation.title')
            : $t('billing.paymentDetails.title')
        }}
      </div>

      <!--Description-->
      <div v-if="paymentData.isCardLinkOperation" class="payment-details__description">
        <p>{{ $t('billing.cardLinking.description') }}&nbsp;{{ nextPaymentDateInSeconds | prettyFullDate(false) }}</p>
        <p>💳 {{ $t('billing.cardLinking.howItWorks') }}</p>
        <ul>
          <li>– {{ $t('billing.cardLinking.step1') }}</li>
          <li>– {{ $t('billing.cardLinking.step2', { date: $options.filters.prettyFullDate(nextPaymentDateInSeconds) }) }}</li>
        </ul>
      </div>
      
      
      <template v-else>
        <i18n
          tag="div"
          :path="isRecurrent ? 'billing.autoProlongation.description' : 'billing.paymentDetails.description'"
          class="payment-details__description"
        />
        
        <!--Details-->
        <div class="payment-details__details">
          <div class="payment-details__details-header">
            {{ $t('billing.paymentDetails.details.title') }}
          </div>
  
          <!--Workspace-->
          <div class="payment-details__details-item">
            <div class="payment-details__details-item-field">
              {{ $t('common.workspace') }}
            </div>
            <EntityImage
              :id="workspace.id"
              :name="workspace.name"
              :title="workspace.name"
              :image="workspace.image"
              size="18"
              class="payment-details__details-item-workspace-image"
            />
  
            <div class="payment-details__details-item-value">
              {{ workspace.name }}
            </div>
          </div>
  
          <!--Plan-->
          <div class="payment-details__details-item">
            <div class="payment-details__details-item-field">
              {{ $t('common.plan') }}
            </div>
            <div class="payment-details__details-item-value">
              {{ readablePlanString }}
            </div>
          </div>
  
          <!--Price-->
          <div class="payment-details__details-item">
            <div class="payment-details__details-item-field">
              {{ $t('common.price') }}
            </div>
            <div class="payment-details__details-item-value">
              {{ price }}
            </div>
          </div>
  
          <!--The next payment date -->
          <!-- <div
            v-if="isRecurrent"
            class="payment-details__details-item"
          >
            <div class="payment-details__details-item-field">
              {{ $t('billing.autoProlongation.theNextPaymentDateTitle') }}
            </div>
            <div class="payment-details__details-item-value">
              {{ nextPaymentDateString | prettyDateFromDateTimeString }}
            </div>
          </div> -->
        </div>
      </template>


      <!--Card-->
      <!-- <CustomSelect
        v-if="cards.length > 1"
        v-model="selectedCard"
        :options="cards"
        :label="$t('common.card').toUpperCase()"
        :need-image="false"
        class="payment-details__card"
      /> -->

      <!--Email for the invoice-->
      <!-- <TextFieldSet
        v-model="email"
        class="payment-details__email"
        :label="
          $t('billing.paymentDetails.details.emailForTheInvoice').toUpperCase()
        "
        :placeholder="email"
        disabled
      /> -->

      <!--Recurrent payment agreements-->
      <section
        v-if="isRecurrent"
        class="payment-details__adoption-autoProlongation"
      >
        <UiCheckboxWithLabel
          v-model="isAcceptedRecurrentPaymentAgreement"
          class="payment-details__adoption-autoProlongation-item"
          :label="$t('billing.autoProlongation.acceptRecurrentPaymentAgreement')"
        />
        <UiCheckboxWithLabel
          v-model="isAcceptedChargingEveryMonth"
          class="payment-details__adoption-autoProlongation-item"
          :label="$t('billing.autoProlongation.allowingChargesEveryMonth')"
        />
        <!-- <UiCheckboxWithLabel
          v-if="!selectedCard || selectedCard.id === NEW_CARD_ID"
          v-model="shouldSaveCard"
          class="payment-details__adoption-autoProlongation-item"
          :label="$t('billing.paymentDetails.allowCardSaving')"
        /> -->
      </section>

      <!--Basic payment agreement-->
      <section
        v-else
        class="payment-details__adoption"
      >
        <UiCheckboxWithLabel
          v-if="!selectedCard || selectedCard.id === NEW_CARD_ID"
          v-model="shouldSaveCard"
          class="payment-details__adoption-autoProlongation-item"
          :label="$t('billing.paymentDetails.allowCardSaving')"
        />

        <UiCheckboxWithLabel
          v-model="isAcceptedPaymentAgreement"
          class="payment-details__adoption-autoProlongation-item"
          :label="$t('billing.paymentDetails.acceptPaymentAgreement')"
        />
      </section>

      <!--Button and cloudpayments logo-->
      <div class="payment-details__bottom">
        <UiButton
          :content="payButtonText"
          class="payment-details__bottom-button"
          :submit="isAcceptedAllAgreements"
          :secondary="!isAcceptedAllAgreements"
          @click.prevent="onGoToServicePayment"
        />

        <a
          :href="cpUrl"
          target="_blank"
        >
          <Icon
            symbol="cloud-payments-logo"
            class="payment-details__bottom-cp-logo"
          />
        </a>
      </div>
    </div>
  </PopupDialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Plan } from '../../types/plan';
import PopupDialog from '../utils/PopupDialog.vue';
import EntityImage from '../utils/EntityImage.vue';
// import CustomSelect from '../forms/CustomSelect.vue';
// import TextFieldSet from '../forms/TextFieldset.vue';
import { Workspace } from '../../types/workspaces';
import { User } from '../../types/user';
import UiButton from '../utils/UiButton.vue';
import Icon from '../utils/Icon.vue';
import notifier from 'codex-notifier';
import axios from 'axios';
import { API_ENDPOINT } from '../../api';
import { BeforePaymentPayload } from '../../types/before-payment-payload';
import { PlanProlongationPayload } from '../../types/plan-prolongation-payload';
import { FETCH_BANK_CARDS } from '@/store/modules/user/actionTypes';
import { RESET_MODAL_DIALOG } from '@/store/modules/modalDialog/actionTypes';
import { PAY_WITH_CARD, GET_BUSINESS_OPERATIONS, FETCH_WORKSPACE } from '@/store/modules/workspaces/actionTypes';
import { BankCard } from '../../types/bankCard';
import CustomSelectOption from '../../types/customSelectOption';
import { PayWithCardInput } from '../../api/billing';
import { BusinessOperation } from '../../types/business-operation';
import { BusinessOperationStatus } from '../../types/business-operation-status';
import UiCheckboxWithLabel from '../forms/UiCheckboxWithLabel/UiCheckboxWithLabel.vue';
import { getCurrencySign } from '@/utils';

/**
 * Id for the 'New card' option in select
 */
const NEW_CARD_ID = 'NEW_CARD';

/**
 * The amount we will debit to confirm the subscription.
 * After confirmation, we will refund the user money.
 */
const AMOUNT_FOR_CARD_VALIDATION = 1;

/**
 * Transforms card data to CustomSelect option
 *
 * @param card - card data to transform
 */
function cardToSelectOption(card: BankCard): CustomSelectOption {
  return {
    id: card.id,
    value: card.id,
    name: `**** **** **** ${card.lastFour}`,
  };
}

export default Vue.extend({
  name: 'PaymentDetailsDialog',
  components: {
    Icon,
    UiButton,
    PopupDialog,
    EntityImage,
    // CustomSelect,
    // TextFieldSet,
    UiCheckboxWithLabel,
  },
  props: {
    /**
     * Workspace id for which the payment is made
     */
    workspaceId: {
      type: String,
      required: true,
    },
    /**
     * New tariff plan id
     */
    tariffPlanId: {
      type: String,
      required: true,
    },

    /**
     * True if payment is recurrent
     */
    isRecurrent: {
      type: Boolean,
      default: false,
    },
    /**
     * Composed payment data
     */
    paymentData: {
      type: Object as () => BeforePaymentPayload,
      required: true,
    },
  },
  data() {
    const workspace: Workspace = this.$store.getters.getWorkspaceById(this.workspaceId) as Workspace;
    const user: User = this.$store.state.user.data;
    const selectedCard: CustomSelectOption | undefined = undefined;

    return {
      /**
       * New card id to use it in template
       */
      NEW_CARD_ID,

      /**
       * User email
       */
      email: user.email,

      /**
       * Accepted or not payment agreement
       */
      isAcceptedPaymentAgreement: false,

      /**
       * Accepted or not recurrent payment agreement
       */
      isAcceptedRecurrentPaymentAgreement: false,

      /**
       * Accepted or not charging every month
       */
      isAcceptedChargingEveryMonth: false,

      /**
       * Workspace for which the payment is made
       */
      workspace,

      /**
       * CloudPayments web page
       */
      cpUrl: 'https://cloudpayments.ru',

      /**
       * Should API save user's bank card or no
       */
      shouldSaveCard: false,

      /**
       * Selected bank card for this payment
       */
      selectedCard,
    };
  },
  computed: {
    /**
     * New plan
     */
    plan(): Plan {
      return this.$store.getters.getPlanById(this.tariffPlanId);
    },

    /**
     * User's bank cards
     */
    cards(): CustomSelectOption[] {
      const cards: BankCard[] = this.$store.state.user.data?.bankCards;

      const newCardOption: CustomSelectOption = {
        id: NEW_CARD_ID,
        value: NEW_CARD_ID,
        name:  this.$t('billing.paymentDetails.newCard') as string,
      };

      if (!cards) {
        return [ newCardOption ];
      }

      return [newCardOption, ...cards.map(cardToSelectOption)];
    },

    /**
     * More readable plan string
     *
     * example: Basic. 100000 events/mo
     */
    readablePlanString(): string {
      return `${this.plan.name}. ${this.plan.eventsLimit} ${this.$t('common.eventsPerMonth')}`;
    },

    /**
     * Price with dollar mark
     *
     * example: 100$
     */
    price(): string {
      return this.$t('common.moneyPerMonth', {
        currency: `${this.plan.monthlyCharge}${getCurrencySign(this.plan.monthlyChargeCurrency)}`,
      }).toString();
    },

    /**
     * Dynamic text for payment button
     */
    payButtonText(): string {
      // if (this.selectedCard && this.selectedCard.id === NEW_CARD_ID) {
      return this.$t('billing.paymentDetails.goToPaymentService').toString();
      // }

      // return this.$t('billing.paymentDetails.payWithSelectedCard').toString();
    },

    /**
     * Due date of the current workspace tariff plan
     */
    planDueDate(): Date {
      const lastChargeDate = new Date(this.workspace.lastChargeDate);

      if (this.workspace.isDebug) {
        lastChargeDate.setDate(lastChargeDate.getDate() + 1);
      } else {
        lastChargeDate.setMonth(lastChargeDate.getMonth() + 1);
      }

      return new Date(lastChargeDate);
    },

    /**
     * Has workspace actual tariff plan or it's expired
     */
    isTariffPlanExpired(): boolean {
      const date = new Date();

      return date > this.planDueDate;
    },

    /**
    * Next payment date
    */
    nextPaymentDate(): Date {
      const date = new Date();

      /**
       * If the tariff plan is expired, we need to debit money now
       * Otherwise, we will debit money when the tariff plan expires
       */
      if (this.isTariffPlanExpired) {
        if (this.workspace.isDebug) {
          date.setDate(date.getDate() + 1);
        } else {
          date.setMonth(date.getMonth() + 1);
        }

        return date;
      }

      return this.planDueDate;
    },

    /**
     * Next payment date as string
     */
    nextPaymentDateString(): string {
      return this.nextPaymentDate.toISOString();
    },

    /**
     * Next payment date in seconds
     */
    nextPaymentDateInSeconds(): number {
      return Math.floor(this.nextPaymentDate.getTime() / 1000);
    },

    /**
     * Accepted or not all agreements
     */
    isAcceptedAllAgreements(): boolean {
      if (this.isRecurrent) {
        return this.isAcceptedRecurrentPaymentAgreement && this.isAcceptedChargingEveryMonth;
      }

      return this.isAcceptedPaymentAgreement;
    },
  },
  // watch: {
  //   /**
  //    * Watcher on cards array
  //    *
  //    * @param newCards - updated cards array
  //    */
  //   cards(newCards: CustomSelectOption[]): void {
  //     if (this.selectedCard) {
  //       return;
  //     }

  //     this.selectedCard = newCards[1] || newCards[0];
  //   },
  // },
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

    this.$store.dispatch(FETCH_BANK_CARDS);
  },
  methods: {
    /**
     * Open service payment
     */
    async onGoToServicePayment(): Promise<void> {
      if (this.isAcceptedAllAgreements) {
        await this.processPayment();
      } else {
        if (this.isRecurrent) {
          if (!this.isAcceptedRecurrentPaymentAgreement) {
            notifier.show({
              message: this.$t('billing.paymentDetails.didNotAcceptRecurrentPaymentAgreement') as string,
              style: 'error',
              time: 5000,
            });
          }
          if (!this.isAcceptedChargingEveryMonth) {
            notifier.show({
              message: this.$t('billing.paymentDetails.didNotAcceptChargingEveryMonth') as string,
              style: 'error',
              time: 5000,
            });
          }
        } else {
          notifier.show({
            message: this.$t('billing.paymentDetails.didNotAccept') as string,
            style: 'error',
            time: 5000,
          });
        }
      }
    },

    /**
     * Method for payment processing
     */
    async processPayment(): Promise<void> {
      this.showPaymentWidget(this.paymentData);
    },

    /**
     * Process payment via saved card
     *
     * @param input - data for processing payment
     */
    async payWithCard(input: PayWithCardInput): Promise<void> {
      try {
        const operation: BusinessOperation = await this.$store.dispatch(PAY_WITH_CARD, input);

        if (operation.status === BusinessOperationStatus.Rejected) {
          notifier.show({
            message: this.$i18n.t('billing.widget.notifications.error') as string,
            style: 'error',
          });
        } else {
          notifier.show({
            message: this.$i18n.t('billing.widget.notifications.success') as string,
            style: 'success',
          });
        }
        await this.$store.dispatch(RESET_MODAL_DIALOG);
      } catch (e) {
        if (e instanceof Error) {
          this.$sendToHawk(e);
        }

        notifier.show({
          message: this.$i18n.t('billing.widget.notifications.error') as string,
          style: 'error',
        });
      }
    },

    /**
     * Method prepares widget and charges money from entered card
     *
     * @param {BeforePaymentPayload} data — server response that sent after beforePay request
     */
    showPaymentWidget(data: BeforePaymentPayload): void {
      const widget = new window.cp.CloudPayments({ language: this.$i18n.locale });

      const paymentData: PlanProlongationPayload = {
        checksum: data.checksum,
      };

      const interval = this.workspace.isDebug ? 'Day' : 'Month';

      if (this.isRecurrent) {
        paymentData.cloudPayments = {
          recurrent: {
            interval,
            period: 1,
          },
        };

        if (!this.isTariffPlanExpired) {
          paymentData.cloudPayments.recurrent.startDate = this.nextPaymentDateString;
          paymentData.cloudPayments.recurrent.amount = data.plan.monthlyCharge;
        }
      }

      const amount = data.isCardLinkOperation ? AMOUNT_FOR_CARD_VALIDATION : data.plan.monthlyCharge;
      const method = data.isCardLinkOperation ? 'auth' : 'charge';
      const titleKey = data.isCardLinkOperation ? 'billing.cloudPaymentsWidget.descriptionCardLinking' : 'billing.cloudPaymentsWidget.description';

      widget.pay(method,
        {
          publicId: process.env.VUE_APP_CLOUDPAYMENTS_PUBLIC_ID,
          description: this.$t(titleKey, {
            tariffPlanName: this.plan.name,
            workspaceName: this.workspace.name,
          }) as string,
          amount,
          currency: data.currency,
          email: this.email,

          /** Label for admin panel */
          invoiceId: data.invoiceId,
          accountId: this.$store.state.user.data.id,

          skin: 'mini',
          data: paymentData,
          /**
           * @todo add autoclose
           */
        },
        {
          onSuccess: () => {
            notifier.show({
              message: this.$i18n.t('billing.widget.notifications.success') as string,
              style: 'success',
            });

            this.$store.dispatch(FETCH_WORKSPACE, this.workspaceId);
          },
          onFail: () => {
            notifier.show({
              message: this.$i18n.t('billing.widget.notifications.error') as string,
              style: 'error',
            });
          },
          onComplete: () => {
            /**
             * Refresh operations history
             */
            this.$store.dispatch(GET_BUSINESS_OPERATIONS, {
              ids: [ this.workspaceId ],
            });
            this.$store.dispatch(RESET_MODAL_DIALOG);
          },
        }
      );
    },
  },

});
</script>

<style>
.payment-details {
  width: 558px;
  padding: 29px 21px 30px;
  color: var(--color-text-main);
  font-size: 14px;

  &__header {
    margin: 0 159px 20px 0;
    font-weight: bold;
    font-size: 18px;
  }

  &__description {
    margin-bottom: 30px;
    line-height: 1.43;
  }

  &__details {
    margin-bottom: 28px;
    font-weight: bold;
    font-size: 12px;
    letter-spacing: 0.15px;

    &-header {
      margin: 0 0 16px;
      color: var(--color-text-second);
      text-transform: uppercase;
    }

    &-item {
      display: flex;
      margin: 19px 20px 15px 0;
      font-weight: normal;
      font-size: 14px;

      &-workspace-image {
        margin: -2px 5px 0 0;
      }

      &-field {
        margin-right: 19px;
      }

      &-value {
        font-weight: bold;
      }
    }
  }

  &__card {
    width: 280px;
    margin-bottom: 28px;
    margin-left: 0;
  }

  &__email {
    width: 280px;
    margin-bottom: 28px;
  }

  &__adoption {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    margin-bottom: 28px;

    &-checkbox {
      margin-right: 12px;
      margin-left: 0;
    }

    &-description {
      margin-top: 6px;
    }

    &-autoProlongation {
      margin-bottom: 28px;
      &-checkbox {
        margin-right: 12px;
        margin-left: 0;
      }

      &-item {
        margin-bottom: 9px;
      }
    }
  }

  &__bottom {
    display: flex;

    &-button {
      margin-right: auto;
    }

    &-cp-logo {
      width: 201px;
      height: 17px;
      margin-top: 12px;
      cursor: pointer;
    }
  }
}
</style>
