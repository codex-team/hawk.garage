/**
 * Data to be sent with pay event to and back from payments server
 */
export interface PlanProlongationPayload {
  /**
   * Hash to check data
   */
  checksum: string;

  /**
   * Data for Cloudpayments needs
   */
  cloudPayments?: CloudPaymentsData;
}

interface CloudPaymentsData {
  /**
   * Data for recurrent payments
   *
   * @see https://developers.cloudpayments.ru/#rekurrentnye-platezhi-podpiska
   */
  recurrent: RecurrentPaymentData;
}

interface RecurrentPaymentData {
  /**
   * Payment interval
   */
  interval: 'Day' | 'Week' | 'Month';

  /**
   * Payment period. That is, how often to withdraw money
   */
  period: number;
}
