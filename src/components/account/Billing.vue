<template>
  <div class="account-billing settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('settings.billing.title') }}
    </div>
    <label class="label account-billing__label">{{ $t('settings.billing.ownedWorkspaces') }}</label>
    <WorkspaceBilling
      v-for="workspace in workspaces"
      :key="workspace.id"
      :workspace="workspace"
    />
  </div>
</template>

<script>
import WorkspaceBilling from '../billing/Workspace';

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
  .account-billing {
    &__label {
      margin-bottom: 15px;
    }
  }
</style>
