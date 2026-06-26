import type { PromoCodeBenefitType } from '@hawk.so/types';

type SupportedPromoCodeBenefitTypes = {
  PercentDiscount: Extract<PromoCodeBenefitType, 'percent_discount'>;
  FixedPrice: Extract<PromoCodeBenefitType, 'fixed_price'>;
};

export const SUPPORTED_PROMO_CODE_BENEFIT_TYPES: SupportedPromoCodeBenefitTypes = {
  PercentDiscount: 'percent_discount',
  FixedPrice: 'fixed_price',
};

export interface PromoCodeVerifyInput {
  workspaceId: string;
  value: string;
}

interface PromoCodeVerifyBase {
  value: string;
  applicablePlanIds?: string[];
}

export type PromoCodeVerify =
  | (PromoCodeVerifyBase & {
    benefitType: typeof SUPPORTED_PROMO_CODE_BENEFIT_TYPES.PercentDiscount;
    percent: number;
    minFinalPrice?: number;
  })
  | (PromoCodeVerifyBase & {
    benefitType: typeof SUPPORTED_PROMO_CODE_BENEFIT_TYPES.FixedPrice;
    amount: number;
  });

export interface PromoCodePricingPlan {
  id: string;
  monthlyCharge: number;
  isHidden?: boolean;
}

export interface PromoCodePlanPrice {
  planId: string;
  isApplicable: boolean;
  originalAmount: number;
  finalAmount: number;
  discountAmount: number;
}
