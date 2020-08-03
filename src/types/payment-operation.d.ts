/**
 * Operation is the record of the transaction with our custom metadata added by Billing
 * (for example, we can add userId, promoId and other fields)
 */
export interface PaymentOperation {
  /**
   * Operation id
   */
  id: string;

  /**
   * Related transaction identifier
   */
  transactionId: string;

  /**
   * One of the transaction type
   */
  type: TransactionType;

  /**
   * Transaction creation datetime
   */
  dtCreated: number;

  /**
   * Custom fields that we wan't to store with transaction
   */
  meta: PaymentOperationMetaData;
}

/**
 * Custom fields that we wan't to store with transaction
 */
interface PaymentOperationMetaData {
  /**
   * In case of a Workspace Deposit operation, we will store a member id who made a deposit
   */
  userId: string;
}

/**
 * Available transaction types
 */
export enum TransactionType {
  /**
   * Transaction that increases account and cashbook
   */
  Deposit,

  /**
   * Transaction that decreases account and cashbook
   */
  Withdrawal,

  /**
   * Transaction that decreases account and increases our revenue
   */
  Purchase
}
