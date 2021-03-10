/**
 * Data to be sent with pay event to and back from payments server
 */
export interface PlanProlongationPayload {
  /**
   * Hash to check data
   */
  checksum: string;

  cloudPayments?: any;
}
