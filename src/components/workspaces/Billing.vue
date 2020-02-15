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
import { FETCH_WORKSPACE } from '../../store/modules/workspaces/actionTypes';

export default {
  name: 'WorkspaceBilling',
  components: {
    BillingHistory,
    BillingCard,
  },
  // Do not show billing page by direct link if user is not admin
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      const user = vm.$store.state.user.data;

      if (!vm.workspace.users) {
        await vm.$store.dispatch(FETCH_WORKSPACE, to.params.workspaceId);
      }

      const { isAdmin } = vm.workspace.users.find(u => u.id === user.id);

      if (!isAdmin) {
        next({ name: 'workspace-settings' });

        return;
      }

      next();
    });
  },
  computed: {
    workspace() {
      const workspaceId = this.$route.params.workspaceId;

      return this.$store.getters.getWorkspaceById(workspaceId);
    },
  },
};
</script>

<style src="../../styles/settings-window-page.css"></style>
