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

  /**
   * True if this is card linking operation.
   * Charging minimal amount of money that will be returned
   */
  isCardLinkOperation: boolean;

  /**
   * Next payment date in ISO string format
   */
  nextPaymentDate: string;
}
