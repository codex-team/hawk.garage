<template>
  <PopupDialog @close="$emit('close')">
    <div class="payment-details">
      <div class="payment-details__header">
        {{ $t('billing.paymentDetails.title') }}
      </div>

      <!--Description-->
      <div class="payment-details__description">
        {{ $t('billing.paymentDetails.description') }}
      </div>

      <!--Details-->
      <div class="payment-details__details">
        <div class="payment-details__details--header">
          {{ $t('billing.paymentDetails.details.title').toUpperCase() }}
        </div>

        <!--Workspace-->
        <div class="payment-details__details--item">
          <div class="payment-details__details--item--field">
            {{ $t('common.workspace') }}
          </div>
          <EntityImage
            :name="workspace.name"
            :title="workspace.name"
            :image="workspace.image"
            size="18"
            class="payment-details__details--item--workspace--image"
          />

          <div class="payment-details__details--item--value">
            {{ workspace.name }}
          </div>
        </div>

        <!--Plan-->
        <div class="payment-details__details--item">
          <div class="payment-details__details--item--field">
            {{ $t('common.plan') }}
          </div>
          <div class="payment-details__details--item--value">
            {{ readablePlanString }}
          </div>
        </div>

        <!--Price-->
        <div class="payment-details__details--item">
          <div class="payment-details__details--item--field">
            {{ $t('common.price') }}
          </div>
          <div class="payment-details__details--item--value">
            {{ priceWithDollar }}
          </div>
        </div>

      </div>

      <!--Card-->
      <CustomSelect
        v-model="card"
        :options="cards"
        :label="$t('common.card').toUpperCase()"
        :need-image="false"
        class="payment-details__card"
      />

      <!--Email for the invoice-->
      <TextFieldSet
        v-model="email"
        :label="$t('billing.paymentDetails.details.emailForTheInvoice').toUpperCase()"
        :placeholder="email"
      />

      <!--Adoption-->
      <div class="payment-details__adoption">
        <UiCheckbox
          class="payment-details__adoption--checkbox"
          v-model="isAcceptedPaymentAgreement"
        />

        <div class="payment-details__adoption--description">
          {{ $t('billing.paymentDetails.acceptPaymentAgreement') }}
        </div>
      </div>

      <!--Button and cloudpayments logo-->
      <div class="payment-details__bottom">
        <UiButton
          content="Go to payment service"
          class="payment-details__bottom--button"
          :submit="isAcceptedPaymentAgreement"
          @click="onGoToServicePayment"
        />

        <Icon
          symbol="cloud-payments-logo"
          class="payment-details__bottom--cp-logo"
        />
      </div>
    </div>
  </PopupDialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Plan } from '../../types/plan';
import PopupDialog from '../utils/PopupDialog.vue';
import EntityImage from '../utils/EntityImage.vue';
import CustomSelect from '../forms/CustomSelect.vue';
import TextFieldSet from '../forms/TextFieldset.vue';
import { Workspace } from '../../types/workspaces';
import { User } from '../../types/user';
import UiButton from '../utils/UiButton.vue';
import UiCheckbox from '../forms/UiCheckbox.vue';
import Icon from '../utils/Icon.vue';
import notifier from 'codex-notifier';

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
  name: 'PaymentDetailsDialog',
  components: {
    Icon,
    UiButton,
    PopupDialog,
    EntityImage,
    CustomSelect,
    TextFieldSet,
    UiCheckbox,
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
  },
  data() {
    const workspace: Workspace = this.$store.getters.getWorkspaceById(this.workspaceId) as Workspace;
    const user: User = this.$store.state.user.data;

    return {
      /**
       * User email
       */
      email: user.email,

      /**
       * User card
       */
      card: cards[0],

      /**
       * All user cards
       */
      cards,

      /**
       * Accepted or not payment agreement
       */
      isAcceptedPaymentAgreement: false,

      /**
       * Workspace id for which the payment is made
       */
      workspace,
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
    priceWithDollar(): string {
      return `${this.plan.monthlyCharge}$`;
    },
  },
  methods: {
    /**
     * Open service payment
     */
    onGoToServicePayment() {
      if (!this.isAcceptedPaymentAgreement) {
        notifier.show({
          message: this.$t('billing.paymentDetails.didNotAccept') as string,
          style: 'error',
          time: 5000,
        });

        return;
      }

      console.log('On Go to service payment');
    },
  },
});
</script>

<style>
  .payment-details {
    width: 558px;
    height: 603px;
    padding: 29px 21px 30px 30px;
    color: var(--color-text-main);

    &__header {
      margin: 0 159px 20px 0;
      font-weight: bold;
      font-size: 18px;
    }

    &__description {
      margin-bottom: 30px;
      color: var(--color-text-second);
    }

    &__details {
      margin-bottom: 30px;
      font-weight: bold;
      font-size: 12px;
      letter-spacing: 0.15px;

      &--header {
        margin: 0 0 16px;
        color: var(--color-text-second);
      }

      &--item {
        display: flex;
        margin: 19px 20px 15px 0;
        font-weight: normal;
        font-size: 14px;

        &--workspace--image {
          margin: -1px 5px 0 0;
        }

        &--field {
          margin-right: 19px;
        }

        &--value {
          font-weight: bold;
        }

      }
    }

    &__card {
      margin-bottom: 20px;
    }

    &__adoption {
      display: flex;
      margin-top: 20px;
      margin-bottom: 20px;

      &--checkbox {
        margin-right: 12px;
        margin-left: 0;
      }

      &--description {
        margin-top: 6px;
      }
    }

    &__bottom {
      display: flex;

      &--button {
        margin-right: 136px;
      }

      &--cp-logo {
        width: 201px;
        height: 17px;
        margin-top: 12px;
      }
    }
  }

  body .cdx-notifies {
    position: fixed;
    z-index: 9995;
  }
</style>