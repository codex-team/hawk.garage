/**
 * Operation is the record of the transaction with our custom metadata added by Billing
 * (for example, we can add userId, promoId and other fields)
 */
import { Workspace } from './workspaces';
import { User } from './user';

/**
 * Business operations statuses
 */
export enum BusinessOperationStatus {
  /**
   * Business operation is pending
   */
  Pending='PENDING',

  /**
   * Business operation is confirmed
   */
  Confirmed='CONFIRMED',

  /**
   * Business operation is rejected
   */
  Rejected='REJECTED'
}

/**
 * Types of business operations
 */
export enum BusinessOperationType {
  /**
   * Workspace plan purchase by payment worker
   */
  WorkspacePlanPurchase='WORKSPACE_PLAN_PURCHASE',

  /**
   * Workspace deposit balance by user
   */
  DepositByUser='DEPOSIT_BY_USER'
}

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
