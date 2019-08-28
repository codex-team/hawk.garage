<template>
  <div class="account-billing settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('settings.billing.title') }}
    </div>
    <BillingCards />
    <label class="label account-billing__label">{{ $t('settings.billing.ownedWorkspaces') }}</label>
    <BillingCard
      v-for="workspace in workspaces"
      v-bind:key="workspace.id"
      :workspace="workspace"
    />
    <BillingHistory />
  </div>
</template>

<script>
import BillingCard from '../billing/Workspace';
import BillingHistory from '../billing/History';
import BillingCards from '../billing/Cards';

export default {
  name: 'AccountBilling',
  components: {
    BillingCards,
    BillingCard,
    BillingHistory
  },
  data() {
    const workspaces = this.$store.state.workspaces.list;

    return {
      workspaces
    };
  }
};
</script>

<style>
  @import "../../styles/settings-window-page.css";

  .account-billing {
    &__label {
      margin-bottom: 15px;
    }
  }
</style>
