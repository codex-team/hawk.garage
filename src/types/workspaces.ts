import { User } from '@/types/user';
import { Plan } from './plan';

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
   * Workspace members array
   */
  team: Member[];

  plan: WorkspacePlan;
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

export interface WorkspacePlan extends Plan {

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
