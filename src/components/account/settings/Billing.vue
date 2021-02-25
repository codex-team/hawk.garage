<template>
  <div class="account-billing settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('settings.billing.title') }}
    </div>

    <div class="account-billing__section">
      <label class="account-billing__label">
        {{ $t('billing.connectedCards') }}
      </label>
      <div class="account-billing__cards">
        <Card
          v-for="card in cards"
          :key="card.id"
          :card="card"
        />
        <AddCard :label="$t('billing.addCardButton')" />
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
import { BankCard } from '@/types/bank-card';
// import { GET_BUSINESS_OPERATIONS } from '../../../store/modules/workspaces/actionTypes';
import { User } from '@/types/user';
import { Workspace } from '@/types/workspaces';
import { FETCH_WORKSPACE } from '@/store/modules/workspaces/actionTypes';
import notifier from 'codex-notifier';

interface BilingComponentData {
  /**
   * Bank Cards
   */
  cards: BankCard[],

  /**
   * User managed workspaces
   */
  workspaces: Workspace[],
}

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
  data(): BilingComponentData {
    return {
      /**
       * Temporary cards for testing
       *
       * @todo replace with the real fetched cards
       */
      cards: [
        {
          id: '1',
          pan: '3123',
          name: '**** **** **** 3123',
        },
        {
          id: '2',
          pan: '3122',
          name: '**** **** **** 3122',
        },
        {
          id: '3',
          pan: '3121',
          name: '**** **** **** 3121',
        },
      ],

      /**
       * User managed workspaces
       */
      workspaces: [],
    };
  },
  computed: {
    /**
     * Workspaces in which current user is admin
     */
  },
  async created() {
    const managedWorkspaces = this.$store.state.workspaces.list.filter(workspace => {
      return this.$store.getters.isCurrentUserAdmin(workspace.id);
    });

    const updatedWorkspaces: Workspace[] = [];

    for (const managedWorkspace of managedWorkspaces) {
      try {
        const w = await this.$store.dispatch(FETCH_WORKSPACE, managedWorkspace.id);

        updatedWorkspaces.push(w);
      } catch (e) {
        notifier.show({
          message: this.$i18n.t(`workspaces.errors.${e.message}`) as string,
          style: 'error',
          time: 5000,
        });
        await this.$router.push({ name: 'home' });
      }
    }

    this.workspaces = updatedWorkspaces;
  },
  methods: {
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
