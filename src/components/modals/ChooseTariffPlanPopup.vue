<template>
  <PopupDialog @close="$emit('close')">
    <div class="choose-plan">
      <img
        class="choose-plan__hero"
        src="../../assets/landscape.png"
      >
      <div class="choose-plan__content">
        <h2 class="choose-plan__title">
          {{ $t('workspaces.chooseTariffPlanDialog.title') }}
        </h2>
        <p
          class="choose-plan__description"
          v-html="$t('workspaces.chooseTariffPlanDialog.description', {featuresURL: '#'})"
        />
        <div class="choose-plan__plans">
          <TariffPlan
            v-for="plan in plans"
            :key="plan.id"
            :name="plan.name"
            :limit="plan.eventsLimit"
            :price="plan.monthlyCharge"
            :selected="plan.id === selectedPlan"
            @click.native="selectPlan(plan.id)"
          />
        </div>
        <UiButton
          class="choose-plan__continue-button"
          :content="$t('common.continue')"
          :disabled="selectedPlan === currentPlan"
          submit
          @click="onContinue"
        />
      </div>
    </div>
  </PopupDialog>
</template>

<script lang="ts">
import Vue from 'vue';
import PopupDialog from '../utils/PopupDialog.vue';
import TariffPlan from '../utils/TariffPlan.vue';
import UiButton from '../utils/UiButton.vue';
import { FETCH_PLANS } from '@/store/modules/plans/actionTypes';
import { mapState } from 'vuex';
import { RootState } from '@/store';
import { Workspace } from '@/types/workspaces';
import { CHANGE_WORKSPACE_PLAN } from '@/store/modules/workspaces/actionTypes';
import notifier from 'codex-notifier';

export default Vue.extend({
  name: 'ChooseTariffPlanPopup',
  components: {
    TariffPlan,
    PopupDialog,
    UiButton,
  },
  data() {
    const { workspaceId } = this.$route.params;

    const workspace = this.$store.getters.getWorkspaceById(workspaceId) as Workspace;

    return {
      /**
       * Current workspace id
       */
      workspaceId,
      /**
       * Id of selected plan
       */
      selectedPlan: workspace.plan.id,

      /**
       * Current plan id
       */
      currentPlan: workspace.plan.id,
    };
  },
  computed: {
    ...mapState({
      /**
       * Available plans list
       *
       * @param {RootState} state - Vuex state
       */
      plans: (state: RootState) => state.plans.list,
    }),
  },
  /**
   * Fetch available plans before component is created
   */
  beforeCreate() {
    this.$store.dispatch(FETCH_PLANS);
  },
  methods: {
    /**
     * Select plan card by id
     *
     * @param id - plan id
     */
    selectPlan(id: string): void {
      if (!this.plans.find(plan => plan.id === id)) {
        return;
      }

      this.selectedPlan = id;
    },

    /**
     * Attempt to change workspace plan
     */
    async onContinue() {
      try {
        await this.$store.dispatch(CHANGE_WORKSPACE_PLAN, {
          workspaceId: this.workspaceId,
          planId: this.selectedPlan,
        });

        notifier.show({
          message: this.$t('workspaces.chooseTariffPlanDialog.onSuccess') as string,
          style: 'success',
          time: 3000,
        });

        this.$emit('close');
      } catch (_) {
        notifier.show({
          message: this.$t('workspaces.chooseTariffPlanDialog.onError') as string,
          style: 'error',
          time: 3000,
        });
      }
    },
  },
});
</script>

<style>
  .choose-plan {
    width: 800px;
    max-width: 800px;
    background: var(--color-bg-second);

    &__hero {
      width: 100%;
      min-height: 225px;
      background-image: linear-gradient(180deg, #081436 0%, #2E4681 100%);
    }

    &__content {
      padding: 30px 50px 35px;
    }

    &__title {
      margin-bottom: 10px;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0;
      color: var(--color-text-main);
    }

    &__description {
      max-width: 450px;
      margin: 0 0 20px;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0;
      color: var(--color-text-second);

      a:not([href*="mailto"]) {
        color: var(--color-indicator-medium);
      }
    }

    &__plans {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__continue-button {
      margin-top: 30px;
    }
  }
</style>
