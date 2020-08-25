<template>
  <div class="billing-history">
    <div class="billing-history__header">
      <div
        class="billing-history__tab"
        :class="{'billing-history__tab--selected': currentFilter === filter.All}"
        @click="applyFilter(filter.All)"
      >
        {{ $t('billing.all') }}
      </div>
      <div
        class="billing-history__tab"
        :class="{'billing-history__tab--selected': currentFilter === filter.Incoming}"
        @click="applyFilter(filter.Incoming)"
      >
        {{ $t('billing.incomings') }}
      </div>
      <div
        class="billing-history__tab"
        :class="{'billing-history__tab--selected': currentFilter === filter.Charges}"
        @click="applyFilter(filter.Charges)"
      >
        {{ $t('billing.charges') }}
      </div>
    </div>
    <div
      v-if="isLoading"
      class="billing-history__loader"
    >
      {{ $t('common.loading') }}
    </div>
    <template v-else-if="operations && operations.length">
      <div
        v-for="(operation, i) in operationsFiltered"
        :key="i"
        class="billing-history__row"
      >
        <div class="billing-history__date">
          {{ operation.dtCreated | prettyDateFromDateTimeString }}
        </div>
        <div class="billing-history__description">
          {{ getDescription(operation) }}
        </div>
        <div class="billing-history__user">
          <EntityImage
            v-if="operation.type === BusinessOperationType.DepositByUser"
            :id="operation.payload.user.id"
            :name="operation.payload.user.name || operation.payload.user.email"
            :image="operation.payload.user.image"
            class="billing-history__user-image"
            size="16"
          />
        </div>
        <div
          class="billing-history__amount"
          :class="[`billing-history__amount--${operation.type}`]"
        >
          {{ getAmountSign(operation) }}
          {{ operation.payload.amount }}$
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
import Vue from 'vue';
import EntityImage from './../EntityImage.vue';
import { BusinessOperationType } from '@/types/business-operation-type';
import i18n from './../../../i18n';
import {
  BusinessOperation,
  PayloadOfDepositByUser,
  PayloadOfWorkspacePlanPurchase
} from '@/types/business-operation';

export default Vue.extend({
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
    const filter = {
      All: 0,
      Incoming: 1,
      Charges: 2,
    };

    return {
      /**
       * Available filters enum
       */
      filter: filter,

      /**
       * Currently selected filter
       */
      currentFilter: filter.All,

      /**
       * Save enum constants to allow access it from the <template>
       */
      BusinessOperationType: {
        WorkspacePlanPurchase: BusinessOperationType.WorkspacePlanPurchase,
        DepositByUser: BusinessOperationType.DepositByUser,
      },
    };
  },
  computed: {
    /**
     * Operations filtered by currentFilter
     */
    operationsFiltered(): BusinessOperation[] {
      const incoming = [
        BusinessOperationType.DepositByUser,
      ];
      const charges = [
        BusinessOperationType.WorkspacePlanPurchase,
      ];

      switch (this.currentFilter) {
        case this.filter.Incoming:
          return this.operations.filter(o => incoming.includes(o.type));

        case this.filter.Charges:
          return this.operations.filter(o => charges.includes(o.type));

        default:
          return this.operations;
      }
    },
  },
  methods: {
    /**
     * Save passed filter as current
     *
     * @param filter - one of this.filter enum values
     */
    applyFilter(filter: number): void {
      this.currentFilter = filter;
    },

    /**
     * Return human readable description for passed business operation
     *
     * @param operation - business operation
     */
    getDescription(operation: BusinessOperation): string {
      switch (operation.type) {
        case BusinessOperationType.DepositByUser: {
          const payload = operation.payload as PayloadOfDepositByUser;

          return i18n.t('billing.operations.paymentByCard', {
            cardPan: payload.cardPan,
          }).toString();
        }

        case BusinessOperationType.WorkspacePlanPurchase: {
          const payload = operation.payload as PayloadOfWorkspacePlanPurchase;

          return i18n.t('billing.operations.chargeForPlan', {
            workspaceName: payload.workspace.name,
          }).toString();
        }

        default:
          return operation.type;
      }
    },

    /**
     * Return '+' or '-' depended on operation type
     *
     * @param operation - business operation
     */
    getAmountSign(operation: BusinessOperation): string {
      switch (operation.type) {
        case BusinessOperationType.DepositByUser:
          return '+';
        case BusinessOperationType.WorkspacePlanPurchase:
          return '–';
        default:
          return '';
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
      display: flex;
      margin: 15px 0 0;
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
      color: var(--color-text-second);
      margin-top: 10px;
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
      width: 150px;
      flex-shrink: 0;
    }

    &__description {
      flex-grow: 2;
      padding-right: 20px;
    }

    &__user {
      margin-left: auto;

      & + ^&__amount {
        margin-left: 15px;
      }
    }

    &__amount {
      margin-left: auto;
      font-weight: 500;
      white-space: nowrap;

      &--DEPOSIT_BY_USER {
        color: var(--color-indicator-positive);
      }
    }

    &__empty {
      @apply --font-small;

      margin-top: 15px;
    }
  }
</style>
