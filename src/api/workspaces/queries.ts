import {
  WORKSPACE_FRAGMENT_WITH_TEAM,
  PROJECT_NOTIFICATIONS_RULE_FRAGMENT,
  WORKSPACE_PLAN,
  EVENT_FRAGMENT
} from '../fragments';

// language=GraphQL
/**
 * Query for getting all user's workspaces and project.
 */
export const QUERY_ALL_WORKSPACES_WITH_PROJECTS = `
  query AllWorkspacesWithProjects {
    workspaces {
      id
      name
      description
      image
      billingPeriodEventsCount
      subscriptionId
      lastChargeDate
      isDebug
      isBlocked
      inviteHash
      ...WorkspaceWithTeam
      ...WorkspacePlan
      paidUntil
      projects {
        id
        token
        name
        description
        image
        unreadCount
        notifications {
          ...ProjectNotificationsRule
        }
        eventGroupingPatterns {
          id
          pattern
        }
        rateLimitSettings {
          N
          T
        }
        dailyEventsPortion(limit: 1) {
          nextCursor {
            groupingTimestampBoundary
            sortValueBoundary
            idBoundary
          }
          dailyEvents {
            id
            count
            affectedUsers
            groupingTimestamp
            event {
              ...Event
            }
          }
        }
      }
    }
  }

  ${WORKSPACE_FRAGMENT_WITH_TEAM}
  ${PROJECT_NOTIFICATIONS_RULE_FRAGMENT}
  ${WORKSPACE_PLAN}
  ${EVENT_FRAGMENT}
`;

// language=GraphQL
/**
 * Mutation for creating new workspace
 */
export const MUTATION_CREATE_WORKSPACE = `
  mutation createWorkspace(
    $name: String!,
    $image: Upload
  ) {
    workspace: createWorkspace(name: $name, image: $image) {
      id
      name
      description
      image
      inviteHash
      ...WorkspaceWithTeam
      ...WorkspacePlan
    }
  }
  ${WORKSPACE_FRAGMENT_WITH_TEAM}
  ${WORKSPACE_PLAN}
`;

// language=GraphQL
/**
 * Mutation to invite user to workspace
 */
export const MUTATION_INVITE_TO_WORKSPACE = `
  mutation inviteToWorkspace(
    $userEmail: String!,
    $workspaceId: ID!
  ) {
    inviteToWorkspace(userEmail: $userEmail, workspaceId: $workspaceId)
  }
`;

// language=GraphQL
/**
 * Mutation to leave workspace
 */
export const MUTATION_LEAVE_WORKSPACE = `
  mutation leaveWorkspace(
    $workspaceId: ID!
  ) {
    leaveWorkspace(workspaceId: $workspaceId)
  }
`;

// language=GraphQL
/**
 * Mutation to join to workspace by invite link
 */
export const MUTATION_JOIN_BY_INVITE_LINK = `
  mutation joinByInviteLink(
    $inviteHash: String!
  ) {
    joinByInviteLink(inviteHash: $inviteHash) {
      recordId
    }
  }
`;

// language=GraphQL
/**
 * Mutation to confirm user invitation
 */
export const MUTATION_CONFIRM_INVITE = `
  mutation confirmInvitation(
    $workspaceId: ID!,
    $inviteHash: String!
  ) {
    confirmInvitation(workspaceId: $workspaceId, inviteHash: $inviteHash) {
      recordId
    }
  }
`;

// language=GraphQL
/**
 * Query for fetching workspaces with id
 */
export const QUERY_WORKSPACES = `
  query fetchWorkspaces($ids: [ID!]) {
    workspaces(ids: $ids) {
      id
      name
      description
      image
      subscriptionId
      lastChargeDate
      isDebug
      isBlocked
      inviteHash
      billingPeriodEventsCount
      ...WorkspacePlan
      ...WorkspaceWithTeam
    }
  }

  ${WORKSPACE_FRAGMENT_WITH_TEAM}
  ${WORKSPACE_PLAN}
`;

// language=GraphQL
/**
 * Query for fetching workspaces with id
 */
export const QUERY_BALANCE = `
  query fetchWorkspaces($ids: [ID!]) {
    workspaces(ids: $ids) {
      id
      balance
    }
  }
`;

// language=GraphQL
/**
 * Mutation for workspace updating
 */
export const MUTATION_UPDATE_WORKSPACE = `
  mutation updateWorkspace(
    $id: ID!
    $name: String!
    $description: String
    $image: Upload
  ) {
    updateWorkspace(workspaceId: $id, name: $name, description: $description, image: $image)
  }
`;

// language=GraphQL
/**
 * Mutation for granting admin permissions
 */
export const MUTATION_GRANT_ADMIN_PERMISSIONS = `
  mutation grantAdmin(
    $workspaceId: ID!
    $userId: ID!
    $state: Boolean = true
  ) {
    grantAdmin(workspaceId: $workspaceId, userId: $userId, state: $state)
  }
`;

// language=GraphQL
/**
 * Mutation to remove user from workspace
 */
export const MUTATION_REMOVE_MEMBER_FROM_WORKSPACE = `
  mutation removeMemberFromWorkspace(
    $workspaceId: ID!
    $userId: ID
    $userEmail: String!
  ) {
    removeMemberFromWorkspace(workspaceId: $workspaceId, userId: $userId, userEmail: $userEmail)
  }
`;

/**
 * Change workspace tariff plan for free plan
 */
// language=GraphQL
export const MUTATION_CHANGE_WORKSPACE_PLAN_TO_DEFAULT = `
    mutation changeWorkspacePlanToDefault(
      $input: changeWorkspacePlanToDefaultInput
    ) {
      changeWorkspacePlanToDefault(input: $input) {
        recordId
        record {
          ...WorkspacePlan
          lastChargeDate
        }
      }
    }

    ${WORKSPACE_PLAN}
`;

/**
 * Cancel subscription on tariff plan
 */
// language=GraphQL
export const MUTATION_CANCEL_SUBSCRIPTION = `
  mutation cancelSubscription($input: CancelSubscriptionInput!) {
    workspace {
      cancelSubscription(input: $input) {
        record {
          id
          subscriptionId
        }
      }
    }
  }
`;

// language=GraphQL
/**
 * Query for getting workspace public info by ID for SSO login page
 * Available without authentication, returns only if SSO is enabled
 */
export const QUERY_SSO_WORKSPACE = `
  query ssoWorkspace($id: ID!) {
    ssoWorkspace(id: $id) {
      id
      name
      image
    }
  }
`;
