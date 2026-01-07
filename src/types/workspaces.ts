import type { User } from '@/types/user';
import type { Plan } from './plan';

/**
 * Workspace representation
 */
export interface Workspace {
  /**
   * Workspace id
   */
  id: string;

  /**
   * Workspace name
   */
  name: string;

  /**
   * Workspace description
   */
  description?: string;

  /**
   * Workspace image
   */
  image?: string;

  /**
   * Invite hash of workspace for invite links
   */
  inviteHash: string;

  /**
   * Workspace members array
   */
  team: Member[];

  /**
   * Workspace tariff plan
   */
  plan: Plan;

  /**
   * Date when workspace was charged last time
   */
  lastChargeDate: Date;

  /**
   * ID of subscription if it subscribed
   * Returns from CloudPayments
   */
  subscriptionId?: string;

  /** True if workspace is used for debugging */
  isDebug?: boolean;

  /** True if workspace is blocked */
  isBlocked?: boolean;
}

/**
 * Represents confirmed member info in DB
 */
export interface ConfirmedMember {
  /**
   * Document id
   */
  id: string;

  /**
   * Id of the member of workspace
   */
  user: User;

  /**
   * Is user admin in workspace
   */
  isAdmin: boolean;
}

/**
 * Represents pending member info in DB
 */
export interface PendingMember {
  /**
   * Document id
   */
  id: string;

  /**
   * User email for invitation
   */
  email: string;
}

/**
 * Represents both member types in workspace team
 */
export type Member = ConfirmedMember | PendingMember;

/**
 * Workspace preview with basic public info
 * Contains only basic fields: id, name, image
 * Used for public-facing features like SSO login page
 */
export type WorkspacePreview = Pick<Workspace, 'id' | 'name' | 'image'> | null;
