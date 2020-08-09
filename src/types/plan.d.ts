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
   * Plan events limit
   */
  eventsLimit: number;

  /**
   * Is plan default
   */
  isDefault?: boolean;
}
