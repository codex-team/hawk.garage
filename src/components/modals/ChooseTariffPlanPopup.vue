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
          v-html="chooseTariffPlanDescription"
        />

        <div class="choose-plan__promo">
          <button
            class="choose-plan__promo-link"
            type="button"
            @click.prevent="isPromoDialogOpen = true"
          >
            {{ promoButtonText }}
          </button>
        </div>

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
            :price="getPlanPrice(plan)"
            :original-price="getPlanOriginalPrice(plan)"
            :discount-label="getPlanDiscountLabel(plan)"
            :currency="plan.monthlyChargeCurrency"
            :selected="plan.id === selectedPlan.id"
            :is-current-plan="isActiveCurrentPlan(plan)"
            :horizontal="plans.length > 3"
            @click="proceedWithPlan(plan)"
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
      </div>
    </div>

    <PromoCodeDialog
      v-if="isPromoDialogOpen"
      :is-loading="isPromoApplying"
      :is-invalid="isPromoInvalid"
      :error-message="promoErrorMessage"
      @apply="verifyPromoCode"
      @close="closePromoDialog"
    />
  </PopupDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PopupDialog from '../utils/PopupDialog.vue';
import PromoCodeDialog from './PromoCodeDialog.vue';
import TariffPlan from '../utils/TariffPlan.vue';
import UiButton from '../utils/UiButton.vue';
import { Workspace } from '@/types/workspaces';
import { Plan } from '@/types/plan';
import { RESET_MODAL_DIALOG, SET_MODAL_DIALOG } from '../../store/modules/modalDialog/actionTypes';
import { VERIFY_PROMO_CODE } from '@/store/modules/workspaces/actionTypes';
import notifier from 'codex-notifier';
import { ActionType } from '../utils/ConfirmationWindow/types';
import type { Utm as UtmInput } from '@hawk.so/types';
import {
  calculatePromoCodePlanPrice,
  SUPPORTED_PROMO_CODE_BENEFIT_TYPES,
  type PromoCodeVerify
} from '@/utils/promoCodePricing';
import { validateUtmParams } from '../utils/utm/utm';

type VerifiedPromoCode = PromoCodeVerify;

export default defineComponent({
  name: 'ChooseTariffPlanPopup',
  components: {
    TariffPlan,
    PopupDialog,
    PromoCodeDialog,
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

      /**
       * Promo code popup visibility.
       */
      isPromoDialogOpen: false,

      /**
       * Promo code apply loading state.
       */
      isPromoApplying: false,

      /**
       * Promo code input invalid state.
       */
      isPromoInvalid: false,

      /**
       * Promo code error text.
       */
      promoErrorMessage: '',

      /**
       * Verified promo code ready for payment.
       */
      verifiedPromo: null as VerifiedPromoCode | null,
    };
  },
  computed: {
    /**
     * Description with injected links
     *
     * @returns {string}
     */
    chooseTariffPlanDescription(): string {
      const emailLink = `<a href="mailto:team@hawk.so">team@hawk.so</a>`;

      return this.$t('workspaces.chooseTariffPlanDialog.description', {
        featuresUrl: '#',
        emailLink,
      }) as string;
    },
    /**
     * Available plans list
     */
    plans(): Plan[] {
      return this.$store.state.plans.list;
    },

    /**
     * Promo button text.
     */
    promoButtonText(): string {
      if (!this.verifiedPromo) {
        return this.$t('billing.promoCode.havePromoCode').toString();
      }

      return this.$t('billing.promoCode.applied', {
        code: this.verifiedPromo.value,
      }).toString();
    },
  },
  methods: {
    proceedWithPlan(plan: Plan): void {
      if (this.isActiveCurrentPlan(plan)) {
        return;
      }

      this.selectedPlan = plan;

      this.onContinue();
    },

    /**
     * Applies entered promo code.
     *
     * @param value - promo code value
     */
    async verifyPromoCode(value: string): Promise<void> {
      this.isPromoApplying = true;
      this.isPromoInvalid = false;
      this.promoErrorMessage = '';

      try {
        const promo = await this.$store.dispatch(VERIFY_PROMO_CODE, {
          workspaceId: this.workspaceId,
          value,
        }) as PromoCodeVerify;

        if (!this.hasApplicablePromoPlan(promo)) {
          throw new Error('PROMO_CODE_INVALID');
        }

        this.verifiedPromo = promo;
        this.closePromoDialog();

        notifier.show({
          message: this.$t('billing.promoCode.notifications.applied') as string,
          style: 'success',
          time: 5000,
        });
      } catch (e) {
        const error = e as Error;
        const key = 'errors.' + error.message;
        const message = this.$te(key) ? this.$t(key) as string : this.$t('errors.PROMO_CODE_INVALID') as string;

        this.isPromoInvalid = true;
        this.promoErrorMessage = message;
        notifier.show({
          message,
          style: 'error',
          time: 5000,
        });
      } finally {
        this.isPromoApplying = false;
      }
    },

    /**
     * Closes promo code dialog.
     */
    closePromoDialog(): void {
      this.isPromoDialogOpen = false;
      this.isPromoInvalid = false;
      this.promoErrorMessage = '';
    },

    /**
     * Gets promo price for plan.
     *
     * @param plan - tariff plan
     * @param promo - verified promo code
     */
    getPromoPlanPrice(plan: Plan, promo: VerifiedPromoCode | null = this.verifiedPromo) {
      if (!promo || this.isActiveCurrentPlan(plan)) {
        return undefined;
      }

      return calculatePromoCodePlanPrice(
        promo,
        {
          id: plan.id,
          monthlyCharge: plan.monthlyCharge,
        }
      );
    },

    /**
     * Returns price to display in plan card.
     *
     * @param plan - tariff plan
     */
    getPlanPrice(plan: Plan): number {
      const promoPlan = this.getPromoPlanPrice(plan);

      return promoPlan?.isApplicable ? promoPlan.finalAmount : plan.monthlyCharge;
    },

    /**
     * Returns old price for discounted plan card.
     *
     * @param plan - tariff plan
     */
    getPlanOriginalPrice(plan: Plan): number | undefined {
      const promoPlan = this.getPromoPlanPrice(plan);

      return promoPlan?.isApplicable ? promoPlan.originalAmount : undefined;
    },

    /**
     * Returns discount label for plan card.
     *
     * @param plan - tariff plan
     */
    getPlanDiscountLabel(plan: Plan): string {
      const promoPlan = this.getPromoPlanPrice(plan);

      if (!this.verifiedPromo || !promoPlan?.isApplicable) {
        return '';
      }

      if (this.verifiedPromo.benefitType === SUPPORTED_PROMO_CODE_BENEFIT_TYPES.PercentDiscount) {
        return `-${this.verifiedPromo.percent}%`;
      }

      return this.$t('billing.promoCode.fixedPriceLabel').toString();
    },

    /**
     * Checks that promo changes at least one visible purchasable plan.
     *
     * @param promo - verified promo code
     */
    hasApplicablePromoPlan(promo: VerifiedPromoCode): boolean {
      return this.plans.some((plan): boolean => this.getPromoPlanPrice(plan, promo)?.isApplicable === true);
    },

    /**
     * Checks whether plan is already active and should not start a new payment flow.
     *
     * Blocked workspaces can still pay for their current plan to restore access.
     *
     * @param plan - tariff plan
     */
    isActiveCurrentPlan(plan: Plan): boolean {
      return plan.id === this.workspace.plan.id && !this.workspace.isBlocked;
    },

    /**
     * Returns payment promo payload for selected plan.
     *
     * @param planId - plan id
     */
    getPaymentPromoPayload(planId: string): {
      promoCode?: string;
      promoUtm?: UtmInput;
    } {
      const plan = this.plans.find(item => item.id === planId);

      if (!plan) {
        return {};
      }

      const promoPlan = this.getPromoPlanPrice(plan);

      if (!this.verifiedPromo || !promoPlan?.isApplicable) {
        return {};
      }

      return {
        promoCode: this.verifiedPromo.value,
        promoUtm: this.getPromoUtm(),
      };
    },

    /**
     * Reads UTM parameters from current URL.
     */
    getPromoUtm(): UtmInput | undefined {
      const params = new URLSearchParams(globalThis.location.search);

      return validateUtmParams({
        source: params.get('utm_source') || undefined,
        medium: params.get('utm_medium') || undefined,
        campaign: params.get('utm_campaign') || undefined,
        content: params.get('utm_content') || undefined,
        term: params.get('utm_term') || undefined,
      });
    },

    /**
     * Attempt to change workspace plan
     */
    async onContinue(): Promise<void> {
      if (this.selectedPlan.monthlyCharge === 0) {
        /**
         * Disable free plan reset:
         * if workspace is already on free plan, do not allow switching to free again
         */
        if (this.workspace.plan.monthlyCharge === 0) {
          notifier.show({
            message: this.$t('workspaces.chooseTariffPlanDialog.freeResetNotAllowed') as string,
            style: 'error',
            time: 5000,
          });

          return;
        }

        this.$confirm.open({
          actionType: ActionType.SUBMIT,
          description: this.$t('workspaces.chooseTariffPlanDialog.confirmSetToFreePlanDescription').toString(),
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
            ...this.getPaymentPromoPayload(this.selectedPlan.id),
          },
        });

        return;
      }

      if (!this.workspace.isBlocked) {
        this.$confirm.open({
          actionType: ActionType.SUBMIT,
          description: this.$t('workspaces.chooseTariffPlanDialog.confirmSetToPaidPlanDescription').toString(),
          onConfirm: async () => {
            await this.$store.dispatch(SET_MODAL_DIALOG, {
              component: 'PaymentDetailsDialog',
              data: {
                workspaceId: this.workspaceId,
                tariffPlanId: this.selectedPlan.id,
                isRecurrent: true,
                ...this.getPaymentPromoPayload(this.selectedPlan.id),
              },
            });
          },
        });
      } else {
        await this.$store.dispatch(SET_MODAL_DIALOG, {
          component: 'PaymentDetailsDialog',
          data: {
            workspaceId: this.workspaceId,
            tariffPlanId: this.selectedPlan.id,
            isRecurrent: true,
            ...this.getPaymentPromoPayload(this.selectedPlan.id),
          },
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

    &__promo {
      margin-bottom: 18px;
    }

    &__promo-link {
      padding: 0;
      color: var(--color-indicator-medium);
      font: inherit;
      font-size: 14px;
      line-height: 20px;
      background: none;
      border: none;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
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
      display: flex;
      align-items: center;
      padding: 20px 25px;
      background: var(--color-bg-main);
      border-radius: 7px;
    }

    &__premium-card-title {
      width: 150px;
      font-weight: 600;
    }

    &__premium-card-limit {
      color: var(--color-text-second);
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0;
    }

    &__premium-card-price {
      margin-right: 20px;
      margin-left: auto;
      color: var(--color-text-second);
      font-weight: 600;
      font-size: 13px;
    }
  }
</style>
