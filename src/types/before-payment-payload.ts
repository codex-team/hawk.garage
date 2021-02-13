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
