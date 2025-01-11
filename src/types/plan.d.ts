/**
 * Hawk tariff plan interface
 */
export interface Plan {
  /**
   * Plan id
   */
  id: string;

  /**
   * Plan name
   */
  name: string;

  /**
   * Plan monthly charge
   */
  monthlyCharge: number;

  /**
   * Plan monthly charge currency
   */
  monthlyChargeCurrency: 'USD' | 'RUB'

  /**
   * Plan events limit
   */
  eventsLimit: number;

  /**
   * Is plan default
   */
  isDefault?: boolean;

  /**
   * How often to charge payment for the plan.
   * Monthly by default.
   */
  paymentFrequency?: 'monthly' | 'daily'
}
