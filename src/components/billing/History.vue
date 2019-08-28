<template>
  <div class="billing-history">
    <label class="label">{{ $t('billing.paymentHistory') }}</label>
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
    <div
      v-for="transaction in transactions"
      :key="transaction.id"
      class="billing-history__row"
    >
      <div class="billing-history__date">
        {{ transaction.date | prettyFullDate }}
      </div>
      <div class="billing-history__description">
        {{ transaction.description }}
      </div>
      <div class="billing-history__user">
        <EntityImage
          v-if="transaction.type === TYPES.INCOME"
          id="1"
          name="User"
          class="billing-history__user-image"
        />
      </div>
      <div
        class="billing-history__amount"
        :class="[`billing-history__amount--${transaction.type}`]"
      >
        {{ transaction.amount }}$
      </div>
    </div>
  </div>
</template>

<script>
import EntityImage from '../utils/EntityImage';
const transactions = [
  {
    id: 1,
    type: 'income',
    date: new Date('August 27, 2019 14:43:00'),
    description: 'Payment by card **** **** **** 1321',
    amount: 300
  },
  {
    id: 2,
    type: 'charge',
    date: new Date('August 1, 2019 00:00:00'),
    description: 'Payment for CodeX current plan',
    amount: 100
  },
  {
    id: 3,
    type: 'income',
    date: new Date('August 27, 2019 14:43:00'),
    description: 'Payment by card **** **** **** 1321',
    amount: 300
  },
  {
    id: 4,
    type: 'charge',
    date: new Date('August 1, 2019 00:00:00'),
    description: 'Payment for CodeX current plan',
    amount: 100
  },
  {
    id: 5,
    type: 'income',
    date: new Date('August 27, 2019 14:43:00'),
    description: 'Payment by card **** **** **** 1321',
    amount: 300
  },
  {
    id: 6,
    type: 'charge',
    date: new Date('August 1, 2019 00:00:00'),
    description: 'Payment for CodeX current plan',
    amount: 100
  },
  {
    id: 7,
    type: 'income',
    date: new Date('August 27, 2019 14:43:00'),
    description: 'Payment by card **** **** **** 1321',
    amount: 300
  },
  {
    id: 8,
    type: 'charge',
    date: new Date('August 1, 2019 00:00:00'),
    description: 'Payment for CodeX current plan',
    amount: 100
  }
];

export default {
  name: 'BillingHistory',
  components: { EntityImage },
  data() {
    return {
      FILTERS: {
        ALL: 0,
        INCOMINGS: 1,
        CHARGES: 2
      },
      TYPES: {
        CHARGE: 'charge',
        INCOME: 'income'
      },
      filter: 0
    };
  },
  computed: {
    transactions() {
      switch (this.filter) {
        case this.FILTERS.INCOMINGS:
          return transactions.filter(t => t.type === this.TYPES.INCOME);

        case this.FILTERS.CHARGES:
          return transactions.filter(t => t.type === this.TYPES.CHARGE);

        default:
          return transactions;
      }
    }
  },
  methods: {
    applyFilter(filter) {
      this.filter = filter;
    }
  }
};
</script>

<style>
  .billing-history {
    width: 600px;
    margin-top: 50px;

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

      &--selected {
        color: var(--color-text-main);
      }
    }

    &__row {
      display: flex;
      padding: 20px 0;
      color: var(--color-text-main);
      font-size: 13px;
      line-height: 15px;
      letter-spacing: 0.16px;
      border-bottom: 1px solid var(--color-border);
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
      width: 16px;
      height: 16px;
      font-size: 10px;
      line-height: 16px;
      border-radius: 5px;
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
  }
</style>
