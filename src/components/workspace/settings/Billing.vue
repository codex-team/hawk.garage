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
import { ConfirmedMember, Workspace } from '@/types/workspaces';
import { GET_BUSINESS_OPERATIONS } from '@/store/modules/workspaces/actionTypes';
import { Route } from 'vue-router';

/**
 * Component local data structure
 */
interface BillingComponentData {
  /**
   * List of payment operations
   */
  paymentsHistory: BusinessOperation[],

  /**
   * Flag determines the loading state of the history
   */
  isPaymentsHistoryLoading: boolean,
}

export default Vue.extend({
  name: 'WorkspaceSettingsBilling',
  components: {
    BillingHistory,
    BillingCard,
  },
  data(): BillingComponentData {
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
  /**
   * Do not show billing page by direct link if user is not admin
   *
   * See https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
   *
   * @param to - the target Route Object being navigated to
   * @param from - the current route being navigated away from
   * @param next - this function must be called to resolve the hook.
   */
  beforeRouteEnter(to: Route, from: Route, next: Function): void {
    next(async vm => {
      const user = vm.$store.state.user.data;

      const team = (vm as unknown as {workspace: Workspace}).workspace.team;
      const userInTeam = (team.find(member => {
        return 'user' in member && member.user.id === user.id;
      }) as ConfirmedMember);

      const { isAdmin } = userInTeam;

      if (!isAdmin) {
        next({ name: 'workspace-settings' });

        return;
      }

      next();
    });
  },
  computed: {
    /**
     * Current Workspace
     */
    workspace(): Workspace {
      const workspaceId = this.$route.params.workspaceId;

      return this.$store.getters.getWorkspaceById(workspaceId);
    },
  },
  async mounted(): Promise<void> {
    this.isPaymentsHistoryLoading = true;

    /**
     * Load operations history
     */
    await this.$store.dispatch(GET_BUSINESS_OPERATIONS, {
      ids: [ this.workspace.id ],
    });

    this.isPaymentsHistoryLoading = false;
  },
});
</script>

<style src="../../../styles/settings-window-page.css"></style>
