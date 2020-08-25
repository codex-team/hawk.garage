<template>
  <div class="workspace-billing settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('workspaces.settings.billing.title') }}
    </div>
    <BillingCard :workspace="workspace" />
    <BillingHistory
      :operations="workspace.paymentsHistory"
      :is-loading="isPaymentsHistoryLoading"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BillingCard from './BillingOverview.vue';
import BillingHistory from '../../utils/billing/History.vue';
import { BusinessOperation } from '../../../types/business-operation';
import { Workspace } from '@/types/workspaces';
import { GET_BUSINESS_OPERATIONS } from '@/store/modules/workspaces/actionTypes';


export default Vue.extend({
  name: 'WorkspaceSettingsBilling',
  components: {
    BillingHistory,
    BillingCard,
  },
  data(): {
    paymentsHistory: BusinessOperation[],
    isPaymentsHistoryLoading: boolean,
    } {
    return {
      /**
       * List of payment operations
       */
      paymentsHistory: [],

      /**
       * Flag determines the loading of the history
       */
      isPaymentsHistoryLoading: false,
    };
  },
  // Do not show billing page by direct link if user is not admin
  // beforeRouteEnter(to, from, next): void {
  //   next(async vm => {
  //     const user = vm.$store.state.user.data;
  //
  //     if (!vm.workspace.users) {
  //       await vm.$store.dispatch(FETCH_WORKSPACE, to.params.workspaceId);
  //     }
  //
  //     const { isAdmin } = vm.workspace.team.find(u => u.user.id === user.id);
  //
  //     if (!isAdmin) {
  //       next({ name: 'workspace-settings' });
  //
  //       return;
  //     }
  //
  //     next();
  //   });
  // },
  computed: {
    workspace(): Workspace {
      const workspaceId = this.$route.params.workspaceId;

      return this.$store.getters.getWorkspaceById(workspaceId);
    },
  },
  async mounted(): Promise<void> {
    this.isPaymentsHistoryLoading = true;

    await this.$store.dispatch(GET_BUSINESS_OPERATIONS, {
      ids: [ this.workspace.id ],
    });

    this.isPaymentsHistoryLoading = false;
  },
});
</script>

<style src="../../../styles/settings-window-page.css"></style>
