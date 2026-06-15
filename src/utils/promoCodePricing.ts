import type {
  FixedPricePromoCodeBenefit,
  PercentDiscountPromoCodeBenefit
} from '@hawk.so/types';

const DEFAULT_MIN_FINAL_PRICE = 1;

/**
 * Promo benefit shape used for price calculation.
 */
export type PromoCodePricingBenefit =
  | PercentDiscountPromoCodeBenefit
  | FixedPricePromoCodeBenefit;

/**
 * Minimal plan fields required for promo price calculation.
 */
export interface PromoCodePricingPlan {
  id?: string;
  _id?: { toString(): string };
  monthlyCharge: number;
  isHidden?: boolean;
}

/**
 * Calculated promo price for one plan.
 */
export interface PromoCodePlanPrice {
  planId: string;
  isApplicable: boolean;
  originalAmount: number;
  finalAmount: number;
  discountAmount: number;
}

/**
 * Returns plan id string for promo pricing.
 *
 * @param plan - plan with id or _id
 */
function getPlanId(plan: PromoCodePricingPlan): string {
  if (plan.id) {
    return plan.id;
  }

  if (plan._id) {
    return plan._id.toString();
  }

  throw new Error('Plan id is required for promo pricing');
}

function isPlanAvailableForPurchase(plan: PromoCodePricingPlan): boolean {
  return plan.isHidden !== true;
}

function isPlanApplicable(benefit: PromoCodePricingBenefit, plan: PromoCodePricingPlan): boolean {
  if (!benefit.applicablePlanIds || benefit.applicablePlanIds.length === 0) {
    return true;
  }

  const planId = getPlanId(plan);

  return benefit.applicablePlanIds.some((applicablePlanId): boolean => applicablePlanId.toString() === planId);
}

function isDiscountablePlan(plan: PromoCodePricingPlan): boolean {
  return plan.monthlyCharge > 0 && isPlanAvailableForPurchase(plan);
}

/**
 * Calculates discounted price for one plan.
 *
 * Keep in sync with api/src/utils/promoCodePricing.ts
 *
 * @param benefit - promo benefit
 * @param plan - selected plan
 */
export function calculatePromoCodePlanPrice(
  benefit: PromoCodePricingBenefit,
  plan: PromoCodePricingPlan
): PromoCodePlanPrice {
  const originalAmount = plan.monthlyCharge;
  const planId = getPlanId(plan);
  const isApplicable = isDiscountablePlan(plan) && isPlanApplicable(benefit, plan);

  if (!isApplicable) {
    return {
      planId,
      isApplicable: false,
      originalAmount,
      finalAmount: originalAmount,
      discountAmount: 0,
    };
  }

  switch (benefit.type) {
    case 'percent_discount': {
      const minFinalPrice = benefit.minFinalPrice ?? DEFAULT_MIN_FINAL_PRICE;
      const discountAmount = Math.floor(originalAmount * benefit.percent / 100);
      const finalAmount = Math.max(originalAmount - discountAmount, minFinalPrice);

      if (finalAmount >= originalAmount) {
        return {
          planId,
          isApplicable: false,
          originalAmount,
          finalAmount: originalAmount,
          discountAmount: 0,
        };
      }

      return {
        planId,
        isApplicable: true,
        originalAmount,
        finalAmount,
        discountAmount: originalAmount - finalAmount,
      };
    }

    case 'fixed_price':
      if (benefit.amount >= originalAmount) {
        return {
          planId,
          isApplicable: false,
          originalAmount,
          finalAmount: originalAmount,
          discountAmount: 0,
        };
      }

      return {
        planId,
        isApplicable: true,
        originalAmount,
        finalAmount: benefit.amount,
        discountAmount: originalAmount - benefit.amount,
      };

    default:
      return {
        planId,
        isApplicable: false,
        originalAmount,
        finalAmount: originalAmount,
        discountAmount: 0,
      };
  }
}
