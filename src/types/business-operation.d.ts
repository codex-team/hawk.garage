/**
 * Operation is the record of the transaction with our custom metadata added by Billing
 * (for example, we can add userId, promoId and other fields)
 */
import type { Workspace } from './workspaces.ts';
import type { User } from './user.ts';
import type { BusinessOperationType } from './business-operation-type.ts';
import type { BusinessOperationStatus } from './business-operation-status.ts';

/**
 * Business operation payload type for `DepositByUser` operation type
 */
export interface PayloadOfDepositByUser {
  /**
   * Workspace to which the payment is credited
   */
  workspace: Workspace;

  /**
   * Amount of payment
   */
  amount: number;

  /**
   * ID of the user who made the payment
   */
  user: User;

  /**
   * PAN of card which user made the payment
   */
  cardPan: string;
}

/**
 * Business operation payload type for `WorkspacePlanPurchase` operation type
 */
export interface PayloadOfWorkspacePlanPurchase {
  /**
   * Workspace to which the payment is debited
   */
  workspace: Workspace;

  /**
   * Amount of payment
   */
  amount: number;

  /**
   * User who made the payment
   */
  user: User;
}

/**
 * Type of business operation payload, it depends of type field
 */
export type BusinessOperationPayloadType = PayloadOfDepositByUser | PayloadOfWorkspacePlanPurchase;

/**
 * Structure represents a Business operation in DataBase
 */
export interface BusinessOperation<T extends BusinessOperationPayloadType = BusinessOperationPayloadType> {
  /**
   * Business operation ID
   */
  _id?: string;

  /**
   * Business operation Transaction ID
   */
  transactionId: string;

  /**
   * Business operation type
   */
  type: BusinessOperationType;

  /**
   * Business operation status
   */
  status: BusinessOperationStatus;

  /**
   * Business operation payload
   */
  payload: T;

  /**
   * Date when operation was created
   */
  dtCreated: number;
}
