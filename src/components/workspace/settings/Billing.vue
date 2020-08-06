<template>
  <div class="workspace-billing settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('workspaces.settings.billing.title') }}
    </div>
    <BillingCard :workspace="workspace" />
    <BillingHistory
      :operations="paymentsHistory"
      :is-loading="isPaymentsHistoryLoading"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BillingCard from './BillingOverview.vue';
import BillingHistory from '../../utils/billing/History.vue';
import { PaymentOperation } from '@/types/payment-operation';
import { Workspace } from '@/types/workspaces';
import { GET_BUSINESS_OPERATIONS } from '@/store/modules/workspaces/actionTypes';


export default Vue.extend({
  name: 'WorkspaceSettingsBilling',
  components: {
    BillingHistory,
    BillingCard,
  },
  data(): {
    paymentsHistory: PaymentOperation[],
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
  //     const { isAdmin } = vm.workspace.users.find(u => u.id === user.id);
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
  mounted(): void {
    this.isPaymentsHistoryLoading = true;

    console.log('call gt', GET_BUSINESS_OPERATIONS);
    this.$store.dispatch(GET_BUSINESS_OPERATIONS, {
      ids: [ this.workspace.id ]
    });

  },
});
</script>

<style src="../../../styles/settings-window-page.css"></style>
