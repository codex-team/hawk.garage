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
 * Query project personal notification settings
 */
// language=GraphQL
export const QUERY_PERSONAL_NOTIFICATION_SETTINGS = `
  query personalNotificationSettings($projectId: ID!){
    personalNotificationSettings(projectId: $projectId){
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
 * Query project common notification settings. Admins only.
 */
// language=GraphQL
export const QUERY_COMMON_NOTIFICATION_SETTINGS = `
  query commonNotificationSettings($projectId: ID!){
    commonNotificationSettings(projectId: $projectId){
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
 * Mutation for updating project personal notifications settings
 */
// language=GraphQL
export const MUTATION_UPDATE_PERSONAL_NOTIFICATION_SETTINGS = `
  mutation updatePersonalNotificationSettings(
    $projectId: ID!,
    $notify: NotifyInput!
  ){
    updatePersonalNotificationSettings(projectId: $projectId, notify: $notify){
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
 * Mutation for updating project common notifications settings
 */
// language=GraphQL
export const MUTATION_UPDATE_COMMON_NOTIFICATION_SETTINGS = `
  mutation updateCommonNotificationSettings($projectId: ID!, $notify: NotifyInput!){
    updateCommonNotificationSettings(projectId: $projectId, notify: $notify ){
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
