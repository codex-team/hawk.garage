/**
 * User saved bank card
 */
export interface BankCard {
  /**
   * Our internal card identifier
   */
  id: string;

  /**
   * The last 4 chars of the card number
   */
  number: string;

  /**
   * Card name
   */
  name: string;
}
