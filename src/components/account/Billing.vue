<template>
  <div class="account-billing settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('settings.billing.title') }}
    </div>
    <BillingCards />
    <label class="label account-billing__label">{{ $t('settings.billing.ownedWorkspaces') }}</label>
    <BillingCard
      v-for="workspace in workspaces"
      :key="workspace.id"
      :workspace="workspace"
    />
    <BillingHistory />
  </div>
</template>

<script>
import BillingCard from '../billing/Workspace';
import BillingHistory from '../billing/History';
import BillingCards from '../billing/Cards';
import { FETCH_WORKSPACES, GET_TRANSACTIONS } from '../../store/modules/workspaces/actionTypes';

export default {
  name: 'AccountBilling',
  components: {
    BillingCards,
    BillingCard,
    BillingHistory
  },
  computed: {
    workspaces() {
      return this.$store.state.workspaces.list.filter(workspace => this.isAdmin(workspace));
    }
  },
  async created() {
    /**
     * Fetch info about workspaces members
     */
    await this.$store.dispatch(FETCH_WORKSPACES);
    /**
     * Fetch workspaces transactions
     */
    await this.$store.dispatch(GET_TRANSACTIONS, { ids: [] });
  },
  methods: {
    isAdmin(workspace) {
      if (!workspace.users) {
        return false;
      }

      const user = this.$store.state.user.data;

      return workspace.users.find(u => u.id === user.id).isAdmin;
    }
  }
};
</script>

<style src="../../styles/settings-window-page.css"></style>

<style>
  .account-billing {
    &__label {
      margin-bottom: 15px;
    }
  }
</style>
