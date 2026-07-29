import type { PromoCodeBenefitType } from '@hawk.so/types';

/**
 * Supported promo benefit types used by Garage pricing UI.
 * Keep in sync with API-supported benefit types.
 */
type SupportedPromoCodeBenefitTypes = {
  /**
   * Percent-off discount benefit
   */
  PercentDiscount: Extract<PromoCodeBenefitType, 'percent_discount'>;

  /**
   * Fixed final price benefit
   */
  FixedPrice: Extract<PromoCodeBenefitType, 'fixed_price'>;
};

/**
 * Runtime map of supported promo benefit type literals
 */
export const SUPPORTED_PROMO_CODE_BENEFIT_TYPES: SupportedPromoCodeBenefitTypes = {
  PercentDiscount: 'percent_discount',
  FixedPrice: 'fixed_price',
};

/**
 * Input for promo code verification mutation
 */
export interface PromoCodeVerifyInput {
  /**
   * Workspace where promo is being applied
   */
  workspaceId: string;

  /**
   * Raw promo code value entered by user
   */
  value: string;
}

/**
 * Shared fields returned for any verified promo code
 */
interface PromoCodeVerifyBase {
  /**
   * Normalized promo code value
   */
  value: string;

  /**
   * Plan ids this promo applies to.
   * Empty or omitted means all plans.
   */
  applicablePlanIds?: string[];
}

/**
 * Verified promo code payload used for client-side price calculation
 */
export type PromoCodeVerify =
  | (PromoCodeVerifyBase & {
    /**
     * Percent discount benefit
     */
    benefitType: typeof SUPPORTED_PROMO_CODE_BENEFIT_TYPES.PercentDiscount;

    /**
     * Discount percent (0–100)
     */
    percent: number;

    /**
     * Minimal allowed final price after discount
     */
    minFinalPrice?: number;
  })
  | (PromoCodeVerifyBase & {
    /**
     * Fixed price benefit
     */
    benefitType: typeof SUPPORTED_PROMO_CODE_BENEFIT_TYPES.FixedPrice;

    /**
     * Final price to charge instead of plan monthly charge
     */
    amount: number;
  });

/**
 * Minimal plan fields required for promo price calculation
 */
export interface PromoCodePricingPlan {
  /**
   * Plan id
   */
  id: string;

  /**
   * Plan monthly charge before promo
   */
  monthlyCharge: number;

  /**
   * Hidden plans are not available for purchase
   */
  isHidden?: boolean;
}

/**
 * Calculated promo price for one plan
 */
export interface PromoCodePlanPrice {
  /**
   * Plan id
   */
  planId: string;

  /**
   * Whether promo discount was applied to this plan
   */
  isApplicable: boolean;

  /**
   * Original plan price before promo
   */
  originalAmount: number;

  /**
   * Final price after promo
   */
  finalAmount: number;

  /**
   * Absolute discount amount
   */
  discountAmount: number;
}
