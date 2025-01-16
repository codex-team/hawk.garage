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
        <!-- eslint-disable vue/no-v-html -->
        <p
          class="choose-plan__description"
          v-html="$t('workspaces.chooseTariffPlanDialog.description', {featuresURL: '#'})"
        />

        <div
          :class="{
            'choose-plan__plans': true,
            'choose-plan__plans--horizontal': plans.length > 3,
          }"
        >
          <TariffPlan
            v-for="plan in plans"
            :key="plan.id"
            :name="plan.name"
            :limit="plan.eventsLimit"
            :price="plan.monthlyCharge"
            :currency="plan.monthlyChargeCurrency"
            :selected="plan.id === selectedPlan.id"
            :is-current-plan="plan.id === workspace.plan.id"
            :horizontal="plans.length > 3"
            @click.native="selectPlan(plan.id)"
          />

          <div class="choose-plan__premium-card">
            <div class="choose-plan__premium-card-title">
              {{ $t('workspaces.chooseTariffPlanDialog.premiumPlan') }}
            </div>

            <div class="choose-plan__premium-card-limit">
              {{ $t('workspaces.chooseTariffPlanDialog.premiumPlanLimit') }}
            </div>

            <div class="choose-plan__premium-card-price">
              {{ $t('workspaces.chooseTariffPlanDialog.premiumPlanPrice') }}
            </div>

            <a href="mailto:team@hawk.so">
              <UiButton
                small
                submit
                rounded
                :content="$t('workspaces.chooseTariffPlanDialog.premiumPlanButtonText')"
                class="tariff-plan__button"
              />
            </a>
          </div>
        </div>

        <UiButton
          class="choose-plan__continue-button"
          :content="$t('common.continue')"
          :disabled="selectedPlan.id === workspace.plan.id"
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
import { Workspace } from '@/types/workspaces';
import { Plan } from '@/types/plan';
import { RESET_MODAL_DIALOG, SET_MODAL_DIALOG } from '../../store/modules/modalDialog/actionTypes';
import notifier from 'codex-notifier';
import { ActionType } from '../utils/ConfirmationWindow/types';

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
       * Workspace for which the tariff plan is selected
       */
      workspace,

      /**
       * Selected plan object
       */
      selectedPlan: workspace.plan,
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
        this.$confirm.open({
          actionType: ActionType.SUBMIT,
          description: this.$i18n.t('workspaces.chooseTariffPlanDialog.confirmSetToFreePlanDescription').toString(),
          onConfirm: async () => {
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

            notifier.show({
              message: this.$t('workspaces.chooseTariffPlanDialog.onSuccess') as string,
              style: 'success',
              time: 5000,
            });

            await this.$store.dispatch(RESET_MODAL_DIALOG);

            return;
          },
        });

        return;
      }

      /**
       * Don't show confirmation window if user changes free plan to paid
       */
      if (this.workspace.plan.monthlyCharge === 0) {
        await this.$store.dispatch(SET_MODAL_DIALOG, {
          component: 'PaymentDetailsDialog',
          data: {
            workspaceId: this.workspaceId,
            tariffPlanId: this.selectedPlan.id,
            isRecurrent: true,
          },
        });

        return;
      }

      this.$confirm.open({
        actionType: ActionType.SUBMIT,
        description: this.$i18n.t('workspaces.chooseTariffPlanDialog.confirmSetToPaidPlanDescription').toString(),
        onConfirm: async () => {
          await this.$store.dispatch(SET_MODAL_DIALOG, {
            component: 'PaymentDetailsDialog',
            data: {
              workspaceId: this.workspaceId,
              tariffPlanId: this.selectedPlan.id,
              isRecurrent: !!this.workspace.subscriptionId,
            },
          });
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
      justify-content: space-between;
    }

    &__plans--horizontal {
      flex-direction: column;
    }

    &__continue-button {
      margin-top: 30px;
    }

    &__premium-card {
      background: var(--color-bg-main);
      border-radius: 7px;
      display: flex;
      align-items: center;
      padding: 20px 25px;
    }

    &__premium-card-title {
      font-weight: 600;
      width: 150px;
    }

    &__premium-card-limit {
      color: var(--color-text-second);
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0;
    }

    &__premium-card-price {
      margin-left: auto;
      color: var(--color-text-second);
      font-weight: 600;
      font-size: 13px;
      margin-right: 20px;
    }
  }
</style>
