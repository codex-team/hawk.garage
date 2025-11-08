import type PaymentData from './paymentData';

/**
 * Data to be sent with pay event to and back from payments server
 */
export interface PlanProlongationPayload extends PaymentData {
  /**
   * Hash to check data
   */
  checksum: string;
}
