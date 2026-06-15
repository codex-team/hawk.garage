import type { PromoCodeApply } from '@/types/billing';
import type { PromoCodePricingBenefit } from '@/utils/promoCodePricing';

/**
 * Builds pricing benefit from validated promo code response.
 *
 * @param promo - promo code apply response
 */
export function buildPromoPricingBenefit(promo: PromoCodeApply): PromoCodePricingBenefit {
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
