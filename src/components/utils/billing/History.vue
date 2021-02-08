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
        <div class="billing-history__tab">
          {{ $t('billing.paymentHistory').toUpperCase() }}
        </div>
      </div>
      <div
        v-for="(operation, i) in operations"
        :key="i"
        class="billing-history__row"
      >
        <div class="billing-history__date">
          {{ operation.dtCreated | prettyDateFromDateTimeString }}
        </div>
        <div class="billing-history__amount">
          {{ operation.payload.amount | centsToDollars }}$
        </div>
        <div class="billing-history__description">
          {{ getDescription(operation) }}
        </div>
        <div class="billing-history__user">
          <EntityImage
            :id="operation.payload.user.id"
            :name="operation.payload.user.name || operation.payload.user.email"
            :image="operation.payload.user.image"
            class="billing-history__user-image"
            size="16"
          />
        </div>
        <div
          class="billing-history__status"
          :class="[`billing-history__status--${operation.status.toLowerCase()}`]"
        >
          {{ $t(`billing.operations.statuses.${operation.status}`) }}
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
    return {
      /**
       * Save enum constants to allow access it from the <template>
       */
      BusinessOperationType: {
        WorkspacePlanPurchase: BusinessOperationType.WorkspacePlanPurchase,
      },
    };
  },
  methods: {
    /**
     * Return human readable description for passed business operation
     *
     * @param operation - business operation
     */
    getDescription(operation: BusinessOperation): string {
      switch (operation.type) {
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
      width: 100px;
    }

    &__description {
      flex-grow: 2;
      text-align: center;
      padding-right: 20px;
    }

    &__user {
      margin-right: 15px;
    }

    &__amount {
      margin-right: 15px;
      font-weight: 500;
      white-space: nowrap;
    }

    &__status {
       width: 90px;
       font-weight: 500;
       white-space: nowrap;

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
      @apply --font-small;

      margin-top: 15px;
    }
  }
</style>
