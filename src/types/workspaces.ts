import {User} from "@/types/user";

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
}

/**
 * Represents confirmed member info in DB
 */
interface ConfirmedMember {
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
interface PendingMember {
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

export function isPendingMember(doc: Member): doc is PendingMember {
  return !!(doc as PendingMember).email && !(doc as ConfirmedMember).user;
}
