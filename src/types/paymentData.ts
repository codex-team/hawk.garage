/**
 * Data for setting up recurring payments
 */
interface RecurrentPaymentSettings {
  /**
   * Payment interval
   */
  interval: 'Day' | 'Week' | 'Month';

  /**
   * Payment period. That is, how often to withdraw money
   */
  period: number;

  /**
   * Subscription start date (first payment)
   */
  startDate?: string;

  /**
   * Recurring payment amount.
   */
  amount?: number;
}

/**
 * Data for the needs of Cloudpayments
 */
interface CloudPaymentsSettings {
  /**
   * Data for recurrent payments
   *
   * @see https://developers.cloudpayments.ru/#rekurrentnye-platezhi-podpiska
   */
  recurrent: RecurrentPaymentSettings;
}

export default interface PaymentData {
  /**
   * Data for Cloudpayments needs
   */
  cloudPayments?: CloudPaymentsSettings;
}
