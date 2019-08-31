<template>
  <div class="account-billing-settings settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('settings.billing.title') }}
    </div>
    <label class="label account-billing-settings__label">{{ $t('settings.billing.ownedWorkspaces') }}</label>
    <WorkspaceBilling
      v-for="workspace in workspaces"
      :key="workspace.id"
      class="account-billing-settings__own-workspace"
      :workspace="workspace"
    />
  </div>
</template>

<script>
import WorkspaceBilling from '../billing/WorkspaceCard';

export default {
  name: 'AccountBilling',
  components: {
    WorkspaceBilling
  },
  computed: {
    workspaces() {
      return this.$store.state.workspaces.list;
    }
  }
};
</script>

<style>
  @import "../../styles/settings-window-page.css";
  .account-billing-settings {
    &__label {
      margin-bottom: 15px;
    }

    &__own-workspace {
      margin-bottom: 20px;
    }
  }
</style>
