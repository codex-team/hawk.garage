<template>
  <div class="billing-history">
    <div
      v-if="isLoading"
      class="billing-history__loader"
    >
      {{ $t('common.loading') }}
    </div>
    <template v-else-if="operations && operations.length">
      <div class="billing-history__header">
        {{ $t('billing.paymentHistory').toUpperCase() }}
      </div>
      <div
        v-for="(operation, i) in filteredOperations"
        :key="i"
        class="billing-history__row"
      >
        <div class="billing-history__date">
          {{ getFormattedDate(operation.dtCreated) }}
        </div>
        <div class="billing-history__user">
          <EntityImage
            v-if="operation.payload.user"
            :id="operation.payload.user.id"
            :name="operation.payload.user.name || operation.payload.user.email"
            :image="operation.payload.user.image"
            class="billing-history__user-image"
            size="16"
          />
        </div>
        <div class="billing-history__amount">
          {{ getAmountString(operation.payload.amount, operation.payload.currency) }}
        </div>
        <div class="billing-history__description">
          {{ getDescription(operation) }}
        </div>
        <div
          class="billing-history__status"
          :class="[`billing-history__status--${operation.status.toLowerCase()}`]"
        >
          {{ $t(`billing.operations.statuses.${getKeyForStatus(operation.status)}`) }}
        </div>
      </div>
    </template>
    <div
      v-else
      class="billing-history__empty"
    >
      {{ $t('billing.paymentHistoryEmpty') }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EntityImage from './../EntityImage.vue';
import { BusinessOperationType } from '@/types/business-operation-type';
import { i18n } from './../../../i18n';
import { BusinessOperation, PayloadOfWorkspacePlanPurchase } from '@/types/business-operation';
import { getCurrencySign } from '@/utils';
import { prettyDateFromDateTimeString } from '@/utils/filters';

export default defineComponent({
  name: 'BillingHistory',
  components: {
    EntityImage,
  },
  props: {
    /**
     * List of payment operations
     */
    operations: {
      type: Array as () => BusinessOperation[],
      default() {
        return [];
      },
    },

    /**
     * Used to show preloader
     */
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      /**
       * Save enum constants to allow access it from the <template>
       */
      BusinessOperationType: {
        WorkspacePlanPurchase: BusinessOperationType.WorkspacePlanPurchase,
      },
    };
  },
  computed: {
    /**
     * Get operations with type `WORKSPACE_PLAN_PURCHASE`
     */
    filteredOperations(): BusinessOperation[] {
      return this.operations;
    },
  },
  methods: {
    /**
     * Format date using prettyDateFromDateTimeString function
     *
     * @param dateValue
     */
    getFormattedDate(dateValue: number | string): string {
      const dateString = typeof dateValue === 'number' ? new Date(dateValue).toISOString() : dateValue;

      return prettyDateFromDateTimeString(dateString);
    },

    getAmountString(amount: number, currency: string): string {
      return (amount / 100) + getCurrencySign(currency);
    },
    /**
     * Get a status key to show it on the page
     *
     * @param status - status
     */
    getKeyForStatus(status: string): string {
      if (status === 'CONFIRMED') {
        return 'processed';
      }

      return status.toLowerCase();
    },
    /**
     * Return human readable description for passed business operation
     *
     * @param operation - business operation
     */
    getDescription(operation: BusinessOperation): string {
      switch (operation.type) {
        case BusinessOperationType.WorkspacePlanPurchase: {
          const payload = operation.payload as PayloadOfWorkspacePlanPurchase;

          return i18n.global.t('billing.operations.chargeForPlan').toString();
        }

        case BusinessOperationType.CardLinkCharge:
          return i18n.global.t('billing.operations.cardLinkingChange').toString();

        case BusinessOperationType.CardLinkRefund:
          return i18n.global.t('billing.operations.cardLinkingRefund').toString();

        default:
          return operation.type;
      }
    },
  },
});
</script>

<style>
  @import url('./../../../styles/custom-properties.css');

  .billing-history {
    max-width: var(--width-popup-form-container);

    &__header {
      @mixin ui-label;
    }

    &__tab {
      margin-right: 30px;
      padding: 10px 0;
      color: var(--color-text-second);
      font-weight: bold;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0.18px;
      cursor: pointer;

      &:hover, &--selected {
        color: var(--color-text-main);
      }
    }

    &__loader {
      margin-top: 10px;
      color: var(--color-text-second);
      font-size: 13px;
    }

    &__row {
      position: relative;
      display: flex;
      padding: 20px 0;
      color: var(--color-text-main);
      font-size: 13px;
      line-height: 18px;
      letter-spacing: 0.16px;

      &::after {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-color: var(--color-text-main);
        opacity: 0.1;
        content: '';
      }
    }

    &__date {
      flex-shrink: 0;
      width: 150px;
    }

    &__description {
      flex-grow: 2;
      padding-right: 20px;
      white-space: normal;
      word-break: break-all;
    }

    &__user {
      margin-right: 10px;
    }

    &__amount {
      width: 60px;
      margin-right: 20px;
      font-weight: 500;
      white-space: nowrap;
    }

    &__status {
       width: 90px;
       font-weight: 500;
       white-space: normal;
       text-align: right;

      &--pending {
         color: var(--color-text-second);
      }

      &--confirmed {
         color: var(--color-indicator-positive);
      }

      &--rejected {
         color: var(--color-indicator-critical);
      }
    }

    &__empty {
      @mixin font-small;

      margin-top: 15px;
    }
  }
</style>
