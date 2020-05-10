import { ConfirmedMember, Member, PendingMember } from '@/types/workspaces';

/**
 * Check is provided member is pending
 *
 * @param member - member to check
 */
export function isPendingMember(member: Member): member is PendingMember {
  return !!(member as PendingMember).email && !(member as ConfirmedMember).user;
}
