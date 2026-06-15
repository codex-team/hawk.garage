import type { PromoCodeVerify } from '@/types/billing';
import type { PromoCodePricingBenefit } from '@/utils/promoCodePricing';

/**
 * Builds pricing benefit from verified promo code response.
 * @param promo - verified promo code response
 */
export function buildPromoPricingBenefit(promo: PromoCodeVerify): PromoCodePricingBenefit {
  if (promo.benefitType === 'percent_discount') {
    return {
      type: 'percent_discount',
      percent: promo.percent ?? 0,
      ...(promo.minFinalPrice !== undefined ? { minFinalPrice: promo.minFinalPrice } : {}),
      ...(promo.applicablePlanIds?.length ? { applicablePlanIds: promo.applicablePlanIds } : {}),
    };
  }

  return {
    type: 'fixed_price',
    amount: promo.amount ?? 0,
    ...(promo.applicablePlanIds?.length ? { applicablePlanIds: promo.applicablePlanIds } : {}),
  };
}
