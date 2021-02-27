/**
 * Data declaration before card charge
 */
import { Plan } from './plan';

export interface BeforePaymentPayload {
  /**
   * Workspace identifier
   */
  workspaceId: string;

  /**
   * Tariff plan
   */
  plan: Plan;

  /**
   * Id of the user who makes payment
   */
  userId: string;

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
