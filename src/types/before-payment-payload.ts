/**
 * Server-calculated payment quote and signed details for the payment widget
 */
export interface BeforePaymentPayload {
  /**
   * Tariff plan
   */
  plan: {
    /**
     * Identifier of the tariff being purchased
     */
    id: string;

    /**
     * Display name of the tariff
     */
    name: string;

    /**
     * Regular monthly price before any promo discount
     */
    monthlyCharge: number;
  };

  /**
   * Unique invoice identifier, format: `WorkspaceNameConsonants year-month-identifier Tariff`
   */
  invoiceId: string;

  /**
   * Amount to charge in the payment currency after any promo discount
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
