import {
  SUPPORTED_PROMO_CODE_BENEFIT_TYPES,
  type PromoCodePlanPrice,
  type PromoCodePricingPlan,
  type PromoCodeVerify
} from '@/types/promoCode';

const DEFAULT_MIN_FINAL_PRICE = 1;
const PERCENT_DIVISOR = 100;

function isPlanAvailableForPurchase(plan: PromoCodePricingPlan): boolean {
  return plan.isHidden !== true;
}

function isPlanApplicable(promo: PromoCodeVerify, plan: PromoCodePricingPlan): boolean {
  if (!promo.applicablePlanIds || promo.applicablePlanIds.length === 0) {
    return true;
  }

  return promo.applicablePlanIds.includes(plan.id);
}

function isDiscountablePlan(plan: PromoCodePricingPlan): boolean {
  return plan.monthlyCharge > 0 && isPlanAvailableForPurchase(plan);
}

/**
 * Calculates discounted price for one plan. Keep in sync with api/src/utils/promoCodePricing.ts
 * @param promo - verified promo code
 * @param plan - selected plan
 */
export function calculatePromoCodePlanPrice(
  promo: PromoCodeVerify,
  plan: PromoCodePricingPlan
): PromoCodePlanPrice {
  const originalAmount = plan.monthlyCharge;
  const result: PromoCodePlanPrice = {
    planId: plan.id,
    isApplicable: false,
    originalAmount,
    finalAmount: originalAmount,
    discountAmount: 0,
  };

  if (!isDiscountablePlan(plan) || !isPlanApplicable(promo, plan)) {
    return result;
  }

  switch (promo.benefitType) {
    case SUPPORTED_PROMO_CODE_BENEFIT_TYPES.PercentDiscount: {
      const minFinalPrice = promo.minFinalPrice ?? DEFAULT_MIN_FINAL_PRICE;
      const discountAmount = Math.floor(originalAmount * promo.percent / PERCENT_DIVISOR);
      const finalAmount = Math.max(originalAmount - discountAmount, minFinalPrice);

      if (finalAmount < originalAmount) {
        result.isApplicable = true;
        result.finalAmount = finalAmount;
        result.discountAmount = originalAmount - finalAmount;
      }

      return result;
    }

    case SUPPORTED_PROMO_CODE_BENEFIT_TYPES.FixedPrice:
      if (promo.amount < originalAmount) {
        result.isApplicable = true;
        result.finalAmount = promo.amount;
        result.discountAmount = originalAmount - promo.amount;
      }

      return result;
  }
}
