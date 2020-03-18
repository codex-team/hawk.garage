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
   * Workspace users array
   */
  users: Member[];

  /**
   * Workspace pending users array
   */
  pendingUsers: Member[];
}

/**
 * Structure represents a member of a Workspace
 */
export interface Member {
  /**
   * Id of record in team:<projectId> collection
   */
  id: string;

  /**
   * Registered user id
   */
  userId: string;

  /**
   * User's email
   */
  email: string

  /**
   * User's name
   */
  name: string

  /**
   * User's image
   */
  image: string

  /**
   * True is user has admin permissions
   */
  isAdmin: boolean

  /**
   * True if user invitation should be confirmed
   */
  isPending: boolean
}
