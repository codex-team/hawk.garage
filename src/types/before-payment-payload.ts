/**
 * Data declaration before card charge
 */
import type { Plan } from './plan.d.ts';

/**
 * Promo data attached to payment
 */
export interface PaymentPromo {
  /**
   * Applied promo code id
   */
  id: string;

  /**
   * Promo benefit type
   */
  benefitType: 'percent_discount' | 'amount_discount' | 'fixed_price';

  /**
   * Plan price before promo
   */
  originalAmount: number;

  /**
   * Plan price after promo
   */
  finalAmount: number;

  /**
   * Actual discount amount
   */
  discountAmount: number;
}

export interface BeforePaymentPayload {
  /**
   * Tariff plan
   */
  plan: Plan;

  /**
   * Unique invoice identifier, format: `WorkspaceNameConsonants year-month-identifier Tariff`
   */
  invoiceId: string;

  /**
   * Payment currency
   */
  currency: string;

  /**
   * Hash to check data consistency
   */
  checksum: string;

  /**
   * True if this is card linking operation.
   * Charging minimal amount of money that will be returned
   */
  isCardLinkOperation: boolean;

  /**
   * Next payment date in ISO string format
   */
  nextPaymentDate: string;

  /**
   * CloudPayments public id (merchant identifier for widget)
   */
  cloudPaymentsPublicId: string;

  /**
   * Applied promo code data
   */
  promo?: PaymentPromo;
}
