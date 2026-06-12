import type { Utm as UtmInput } from '@hawk.so/types';

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
 * Calculated promo price for a plan.
 */
export interface PromoCodePlanPrice {
  planId: string;
  isApplicable: boolean;
  originalAmount: number;
  finalAmount: number;
  discountAmount: number;
}

/**
 * Promo code preview/apply response.
 */
export interface PromoCodePreview {
  value: string;
  benefitType: 'grant_plan' | 'percent_discount' | 'amount_discount' | 'fixed_price';
  applied: boolean;
  percent?: number;
  amount?: number;
  plans: PromoCodePlanPrice[];
}
