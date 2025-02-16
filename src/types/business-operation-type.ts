/**
 * Types of business operations
 */
export enum BusinessOperationType {
  /**
   * Workspace plan purchase by payment worker
   */
  WorkspacePlanPurchase = 'WORKSPACE_PLAN_PURCHASE',

  /**
   * Workspace deposit balance by user
   */
  DepositByUser = 'DEPOSIT_BY_USER',

  /**
   * Charge minimal amount of money to link a card for further recurrent payments
   */
  CardLinkCharge = 'CARD_LINK_CHARGE',

  /**
   * Refund the money that were charged to link a card
   */
  CardLinkRefund = 'CARD_LINK_REFUND',
}
