/**
 * Data declaration before card charge
 */
export interface BeforePaymentPayload {
  /**
   * Workspace identifier
   */
  workspaceId: string;

  /**
   * Tariff: service plan
   */
  tariffId: string;

  /**
   * Unique invoice identifier, format: `WorkspaceNameConsonants year-month-identifier Tariff`
   */
  invoiceId: string;

  /**
   * Substraction amount according to the tariff
   */
  amount: number;

  /**
   * Payment currency
   */
  currency: string;

  /**
   * Hash to check data consistency
   */
  checksum: string;
}
