/**
 * Data declaration before card charge
 */
import { Plan } from './plan';

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
}
