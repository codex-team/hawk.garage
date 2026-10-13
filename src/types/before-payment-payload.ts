/**
 * Data declaration before card charge
 */

export interface BeforePaymentPayload {
  /**
   * Tariff plan
   */
  plan: {
    id: string;
    name: string;
    monthlyCharge: number;
  };

  /**
   * Unique invoice identifier, format: `WorkspaceNameConsonants year-month-identifier Tariff`
   */
  invoiceId: string;

  /**
   * Amount to charge for this payment
   */
  paymentAmount: number;

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
}
