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
