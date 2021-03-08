import {
  WORKSPACE_FRAGMENT_WITH_TEAM,
  USER_FRAGMENT,
  PROJECT_NOTIFICATIONS_RULE_FRAGMENT,
  WORKSPACE_PLAN
} from '../fragments';

// language=GraphQL
/**
 * Query for getting all user's workspaces and project.
 */
export const QUERY_ALL_WORKSPACES_WITH_PROJECTS = `
  {
    workspaces {
      id
      name
      description
      image
      billingPeriodEventsCount
      subscriptionId
      lastChargeDate
      ...WorkspaceWithTeam
      ...WorkspacePlan
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
        recentEvents(limit: 1) {
          events {
            id
            groupHash
            visitedBy {
              ...User
            }
            marks {
              resolved
              starred
              ignored
            }
            payload {
              timestamp
              title
            }
          }
          dailyInfo {
            groupHash
            count
            groupingTimestamp
            lastRepetitionTime
          }
        }
      }
    }
  }

  ${USER_FRAGMENT}
  ${WORKSPACE_FRAGMENT_WITH_TEAM}
  ${PROJECT_NOTIFICATIONS_RULE_FRAGMENT}
  ${WORKSPACE_PLAN}
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
    createWorkspace(name: $name, image: $image) {
      id
      name
      description
      image
      ...WorkspaceWithTeam
    }
  }

  ${WORKSPACE_FRAGMENT_WITH_TEAM}
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
 * Mutation to confirm user invitation
 */
export const MUTATION_CONFIRM_INVITE = `
  mutation confirmInvitation(
    $workspaceId: ID!,
    $inviteHash: String
  ) {
    confirmInvitation(workspaceId: $workspaceId, inviteHash: $inviteHash)
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
 * Change workspace tariff plan
 */
// language=GraphQL
export const MUTATION_CHANGE_WORKSPACE_PLAN = `
    mutation changeWorkspacePlan(
      $input: ChangeWorkspacePlanInput
    ) {
      changeWorkspacePlan(input: $input) {
        recordId
        record {
          id
          name
          description
          image
          billingPeriodEventsCount
          subscriptionId
          lastChargeDate
          ...WorkspaceWithTeam
          ...WorkspacePlan
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
            recentEvents(limit: 1) {
              events {
                id
                groupHash
                visitedBy {
                  ...User
                }
                marks {
                  resolved
                  starred
                  ignored
                }
                payload {
                  timestamp
                  title
                }
              }
              dailyInfo {
                groupHash
                count
                groupingTimestamp
                lastRepetitionTime
              }
            }
          }
        }
      }
    }

    ${USER_FRAGMENT}
    ${WORKSPACE_FRAGMENT_WITH_TEAM}
    ${PROJECT_NOTIFICATIONS_RULE_FRAGMENT}
    ${WORKSPACE_PLAN}
`;
