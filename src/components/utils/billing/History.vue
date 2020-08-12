<template>
  <div class="billing-history">
    <div class="billing-history__header">
      <div
        class="billing-history__tab"
        :class="{'billing-history__tab--selected': filter === FILTERS.ALL}"
        @click="applyFilter(FILTERS.ALL)"
      >
        {{ $t('billing.all') }}
      </div>
      <div
        class="billing-history__tab"
        :class="{'billing-history__tab--selected': filter === FILTERS.INCOMINGS}"
        @click="applyFilter(FILTERS.INCOMINGS)"
      >
        {{ $t('billing.incomings') }}
      </div>
      <div
        class="billing-history__tab"
        :class="{'billing-history__tab--selected': filter === FILTERS.CHARGES}"
        @click="applyFilter(FILTERS.CHARGES)"
      >
        {{ $t('billing.charges') }}
      </div>
    </div>
    {{ isLoading}}
    <div
      v-if="isLoading"
      class="billing-history__loader"
    >
      {{ $t('common.loading') }}
    </div>
    <template v-else-if="operations && operations.length">
      <div
        v-for="(operation, i) in operations"
        :key="i"
        class="billing-history__row"
      >
        <div class="billing-history__date">
          {{ new Date(operation.dtCreated) | prettyFullDate }}
        </div>
        <div class="billing-history__description">
          {{ getDescription(transaction) }}
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
          {{ operation.amount }}$
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
import {BusinessOperation, BusinessOperationType} from '../../../types/business-operation';

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
      default(){
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
      FILTERS: {
        ALL: 0,
        INCOMINGS: 1,
        CHARGES: 2,
      },
      filter: 0,
      /**
       * Save enum constants to allow access it from the <template>
       */
      BusinessOperationType: {
        // WorkspacePlanPurchase: BusinessOperationType.WorkspacePlanPurchase,
        // DepositByUser: BusinessOperationType.DepositByUser,
      },
    };
  },
  computed: {
    transactions() {
      /**
       * @todo remove and refactor the code below
       */
      return [];

      // const user = this.$store.state.user.data;
      //
      // let transactions = [];
      //
      // if (this.workspace) {
      //   transactions = this.$store.getters.getWorkspaceById(this.workspace.id).transactions || [];
      // } else {
      //   transactions = this.$store.state.workspaces.list.reduce((acc, workspace) => {
      //     if (!workspace.users || !workspace.users.find(u => u.id === user.id).isAdmin) {
      //       return acc;
      //     }
      //
      //     return acc.concat(workspace.transactions || []);
      //   }, []);
      //
      //   transactions.sort((a, b) => +new Date(b.date) - +new Date(a.date));
      // }
      //
      // switch (this.filter) {
      //   case this.FILTERS.INCOMINGS:
      //     return transactions.filter(t => t.type === this.TYPES.INCOME);
      //
      //   case this.FILTERS.CHARGES:
      //     return transactions.filter(t => t.type === this.TYPES.CHARGE);
      //
      //   default:
      //     return transactions;
      // }
    },
  },
  created() {
    /**
     * 2020 jul 15 - Commented to prevent errors
     *
     * @todo separate table to the abstract UITable component
     */
  },
  methods: {
    applyFilter(filter) {
      this.filter = filter;
    },
    getDescription(transaction) {
      return '';
      // switch (transaction.type) {
      //   case this.TYPES.INCOME:
      //     return `Payment by card **** **** ***** ${transaction.cardPan} for ${transaction.workspace.name}`;
      //   case this.TYPES.CHARGE:
      //     return `Payment for ${transaction.workspace.name} current plan`;
      // }
    },
  },
});
</script>

<style>
  @import url('./../../../styles/custom-properties.css');

  .billing-history {
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
      line-height: 15px;
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
      flex-basis: 145px;
    }

    &__user {
      margin-left: auto;

      & + ^&__amount {
        margin-left: 15px;
      }
    }

    &__user-image {
      margin-top: -1px;
    }

    &__amount {
      margin-left: auto;
      font-weight: 500;

      &--income {
        color: #2ccf6c;

        &::before {
          content: '+';
        }
      }

      &--charge::before {
        content: '-';
      }
    }

    &__empty {
      @apply --font-small;

      margin-top: 15px;
    }
  }
</style>
