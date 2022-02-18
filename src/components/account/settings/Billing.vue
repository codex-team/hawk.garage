<template>
  <div class="account-billing settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('settings.billing.title') }}
    </div>

    <div 
      v-if="cards.length > 0"
      class="account-billing__section"
    >
      <label class="account-billing__label">
        {{ $t('billing.connectedCards') }}
      </label>
      <div class="account-billing__cards">
        <Card
          v-for="card in cards"
          :key="card.id"
          :card="card"
        />
        <!-- <AddCard :label="$t('billing.addCardButton')" /> -->
      </div>
    </div>

    <div class="account-billing__section">
      <label class="account-billing__label">
        {{ $t('settings.billing.managedWorkspaces') }}
      </label>
      <BillingWorkspace
        v-for="workspace in workspaces"
        :key="workspace.id"
        :workspace="workspace"
      />
    </div>

    <div class="account-billing__section">
      <label class="account-billing__label">
        {{ $t('billing.paymentHistory') }}
      </label>
      <BillingHistory />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BillingWorkspace from '../../workspace/settings/BillingOverview.vue';
import BillingHistory from '../../utils/billing/History.vue';
import Card from '../../utils/billing/BankCard.vue';
import AddCard from '../../utils/billing/BankCardAdd.vue';
import { BankCard } from '../../../types/bankCard';
import { FETCH_BANK_CARDS } from '@/store/modules/user/actionTypes';

import { User } from '@/types/user';
import { Workspace } from '@/types/workspaces';

export default Vue.extend({
  name: 'AccountBilling',
  components: {
    BillingWorkspace,
    Card,
    AddCard,
    BillingHistory,
  },
  props: {
    /**
     * Current user
     */
    user: {
      type: Object as () => User,
      required: true,
    },
  },
  computed: {
    /**
     * Workspaces in which current user is admin
     */
    workspaces(): Workspace[] {
      return this.$store.state.workspaces.list.filter(workspace => {
        return this.$store.getters.isCurrentUserAdmin(workspace.id);
      });
    },

    /**
     * User's bank cards
     */
    cards(): BankCard[] {
      const cards: BankCard[] = this.$store.state.user.data?.bankCards;

      if (!cards) {
        return [];
      }

      return cards;
    },
  },
  mounted() {
    this.$store.dispatch(FETCH_BANK_CARDS);
  },
});
</script>

<style src="../../../styles/settings-window-page.css"></style>

<style>
  @import url('./../../../styles/custom-properties.css');

  .account-billing {
    &__section {
      max-width: var(--width-popup-form-container);
      margin-bottom: 50px;
    }

    &__label {
      @apply --ui-label;
      display: block;
      margin-bottom: 15px;
    }

    &__cards {
      display: flex;
      flex-flow: row wrap;
    }
  }
</style>
