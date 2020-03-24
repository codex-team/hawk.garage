// language=GraphQL
/**
 * Fragment for fetching workspace with full team
 */
export const WORKSPACE_FRAGMENT_WITH_TEAM = `
  fragment WorkspaceWithTeam on Workspace {
    team {
      __typename
      ...on ConfirmedMember {
        id
        user {
          id
          email
          image
        }
        isAdmin
      }

      ...on PendingMember {
        id
        email
      }
    }
  }
`;

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
      ...WorkspaceWithTeam
      projects {
        id
        token
        name
        description
        image
        unreadCount
        recentEvents(limit: 1) {
          events {
            id
            groupHash
            visitedBy
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

  ${WORKSPACE_FRAGMENT_WITH_TEAM}
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
      balance
      plan {
        name
        subscriptionDate
        lastChargeDate
        monthlyCharge
        eventsLimit
      }
      ...WorkspaceWithTeam
    }
  }
  ${WORKSPACE_FRAGMENT_WITH_TEAM}
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
    $userId: ID,
    $userEmail: String!
  ) {
    removeMemberFromWorkspace(workspaceId: $workspaceId, userId: $userId, userEmail: $userEmail)
  }
`;
