/**
 * User saved bank card
 */
export interface BankCard {
  /**
   * Our internal card identifier
   */
  id: string;

  /**
   * Last four numbers of card PAN
   */
  lastFour: number;
}
