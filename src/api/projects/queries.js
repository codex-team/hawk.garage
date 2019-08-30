/**
 * Mutation for creating new project
 */
// language=GraphQL
export const MUTATION_CREATE_PROJECT = `
  mutation createProject(
    $name: String!,
    $workspaceId: ID!
  ) {
    createProject(name: $name, workspaceId: $workspaceId) {
      id
      name
      image
    }
  }
`;

/**
 * Query recent errors
 */
// language=GraphQL
export const QUERY_RECENT_ERRORS = `
  query RecentErrors($projectId: ID!) {
    recent(projectId: $projectId) {
      date
      count
      event {
        id
        payload {
          title
          timestamp
        }
      }
    }
  }
`;

/**
 * Query project notification settings
 */
// language=GraphQL
export const QUERY_NOTIFICATION_SETTINGS = `
  query NotifiactionSettings($projectId: ID!){
    notificationSettings(projectId: $projectId){
      actionType
      words
      settings {
        email {
          enabled
          value
        }
        tg {
          enabled
          value
        }
        slack {
          enabled
          value
        }
      }
    }
  }
`;

/**
 * Mutation for updating notifications settings
 */
// language=GraphQL
export const MUTATION_UPDATE_NOTIFICATION_SETTINGS = `
  mutation UpdateNotificationSettings(
    $projectId: ID!,
    $notify: NotifyInput!
  ){
    updateNotificationSettings(projectId: $projectId, notify: $notify )
  }
`;
