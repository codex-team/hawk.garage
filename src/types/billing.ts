import type { PromoCodeBenefitType, Utm as UtmInput } from '@hawk.so/types';

/**
 * Compose payment input.
 */
export interface ComposePaymentInput {
  workspaceId: string;
  tariffPlanId: string;
  shouldSaveCard?: boolean;
  promoCode?: string;
  promoUtm?: UtmInput;
}

/**
 * Data for processing payment with saved card.
 */
export interface PayWithCardInput {
  /**
   * Checksum for payment validation.
   */
  checksum: string;

  /**
   * Saved card id for payment.
   */
  cardId: string;

  /**
   * Is payment recurrent or not. If payment is recurrent, then the money will be debited every month.
   */
  isRecurrent?: boolean;
}

/**
 * Promo code apply input.
 */
export interface PromoCodeApplyInput {
  workspaceId: string;
  value: string;
}

/**
 * Validated promo code data for client-side price calculation.
 */
export interface PromoCodeApply {
  value: string;
  benefitType: PromoCodeBenefitType;
  percent?: number;
  amount?: number;
  minFinalPrice?: number;
  applicablePlanIds?: string[];
}
