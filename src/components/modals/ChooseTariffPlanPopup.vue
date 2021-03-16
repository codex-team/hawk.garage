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
            :selected="plan.id === selectedPlan.id"
            @click.native="selectPlan(plan.id)"
          />
        </div>
        <UiButton
          class="choose-plan__continue-button"
          :content="$t('common.continue')"
          :disabled="selectedPlan.id === currentPlan.id"
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
import { Workspace } from '@/types/workspaces';
import { Plan } from '@/types/plan';
import { SET_MODAL_DIALOG, RESET_MODAL_DIALOG } from '../../store/modules/modalDialog/actionTypes';
import notifier from 'codex-notifier';

export default Vue.extend({
  name: 'ChooseTariffPlanPopup',
  components: {
    TariffPlan,
    PopupDialog,
    UiButton,
  },
  props: {
    /**
     * Id of a workspace for which modal is open
     */
    workspaceId: {
      type: String,
      required: true,
    },
  },
  data() {
    const workspace = this.$store.getters.getWorkspaceById(this.workspaceId) as Workspace;

    return {
      /**
       * Selected plan object
       */
      selectedPlan: workspace.plan,

      /**
       * Current plan object
       */
      currentPlan: workspace.plan,
    };
  },
  computed: {
    /**
     * Available plans list
     */
    plans(): Plan[] {
      return this.$store.state.plans.list;
    },
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
      const plan = this.plans.find(p => p.id === id);

      if (!plan) {
        return;
      }

      this.selectedPlan = plan;
    },

    /**
     * Attempt to change workspace plan
     */
    async onContinue(): Promise<void> {
      if (this.selectedPlan.monthlyCharge === 0) {
        const result = await this.$store.dispatch('CHANGE_WORKSPACE_PLAN_FOR_FREE_PLAN', {
          workspaceId: this.workspaceId,
          planId: this.selectedPlan.id,
        });

        if (!result) {
          notifier.show({
            message: this.$t('workspaces.chooseTariffPlanDialog.onError') as string,
            style: 'error',
            time: 5000,
          });

          return;
        }

        this.currentPlan = this.selectedPlan;

        notifier.show({
          message: this.$t('workspaces.chooseTariffPlanDialog.onSuccess') as string,
          style: 'success',
          time: 5000,
        });

        this.$store.dispatch(RESET_MODAL_DIALOG);

        return;
      }

      this.$store.dispatch(SET_MODAL_DIALOG, {
        component: 'ProcessPaymentDialog',
        data: {
          tariffPlanId: this.selectedPlan.id,
          workspaceId: this.workspaceId,
        },
      });
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
      color: var(--color-text-main);
      font-weight: 600;
      font-size: 18px;
      letter-spacing: 0;
    }

    &__description {
      max-width: 450px;
      margin: 0 0 20px;
      color: var(--color-text-second);
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0;

      a:not([href*="mailto"]) {
        color: var(--color-indicator-medium);
      }
    }

    &__plans {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__continue-button {
      margin-top: 30px;
    }
  }
</style>
