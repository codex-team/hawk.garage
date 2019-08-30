<template>
  <div class="workspace-billing settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('workspaces.settings.billing.title') }}
    </div>
    <BillingCard :workspace="workspace" />
    <BillingHistory :workspace="workspace" />
  </div>
</template>

<script>
import BillingCard from '../billing/Workspace';
import BillingHistory from '../billing/History';

export default {
  name: 'WorkspaceBilling',
  components: { BillingHistory, BillingCard },
  computed: {
    workspace() {
      const workspaceId = this.$route.params.workspaceId;

      return this.$store.getters.getWorkspaceById(workspaceId);
    }
  }
};
</script>

<style>
  @import "../../styles/settings-window-page.css";
</style>
