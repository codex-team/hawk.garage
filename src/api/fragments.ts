// language=GraphQL
/**
 * Fragment represents user
 */
export const USER_FRAGMENT = `
  fragment User on User {
    id
    email
    name
    image
  }
`;

// language=GraphQL
/**
 * Fragment represents event backtrace
 */
export const EVENT_BACKTRACE = `
  fragment eventBacktrace on EventBacktraceFrame {
    file
    line
    column
    sourceCode {
      line
      content
    }
    function
    arguments
  }
`;

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
 * All properties of a single project notifications rule
 */
export const PROJECT_NOTIFICATIONS_RULE_FRAGMENT = `
  fragment ProjectNotificationsRule on ProjectNotificationsRule {
    id
    isEnabled
    whatToReceive
    including
    excluding
    channels {
      email {
        endpoint
        isEnabled
      }
      slack {
        endpoint
        isEnabled
      }
      telegram {
        endpoint
        isEnabled
      }
    }
  }
`;

// language=GraphQL
/**
 * This fields stored in users.notifications record
 */
export const USER_NOTIFICATIONS_FRAGMENT = `
  fragment UserNotifications on UserNotificationsSettings {
    channels {
      email {
        isEnabled
        endpoint
      }
      webPush {
        isEnabled
        endpoint
      }
      desktopPush {
        isEnabled
        endpoint
      }
    }
    whatToReceive {
      IssueAssigning
      WeeklyDigest
      SystemMessages
    }
  }
`;

/**
 * Query fragment for workspace tariff plan
 */
// language=GraphQL
export const WORKSPACE_PLAN = `
  fragment WorkspacePlan on Workspace {
    plan {
      id
      name
      monthlyCharge
      eventsLimit
    }
  }
`;

// language=GraphQL
export const WORKSPACE_PROJECTS = `
  fragment WorkspaceProjects on Workspace {
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

  ${PROJECT_NOTIFICATIONS_RULE_FRAGMENT}
  ${USER_FRAGMENT}
`;
