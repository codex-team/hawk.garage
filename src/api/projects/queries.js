import {
  PROJECT_NOTIFICATIONS_RULE_FRAGMENT
} from '../fragments';

/**
 * Mutation for creating new project
 */
// language=GraphQL
export const MUTATION_CREATE_PROJECT = `
  mutation createProject(
    $name: String!,
    $workspaceId: ID!
    $image: Upload
  ) {
    createProject(name: $name, workspaceId: $workspaceId, image: $image) {
      id
      name
      image
      token
    }
  }
`;

// language=GraphQL
/**
 * Mutation for project updating
 */
export const MUTATION_UPDATE_PROJECT = `
    mutation updateProject(
        $id: ID!
        $name: String!
        $description: String
        $image: Upload
    ) {
        updateProject(id: $id, name: $name, description: $description, image: $image)
        {
            id
            name
            description
            image
        }
    }
`;

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

// language=GraphQL
export const MUTATION_UPDATE_LAST_VISIT = `
    mutation lastProjectVisit($projectId: ID!) {
        updateLastProjectVisit(projectId: $projectId)
    }
`;

// language=GraphQL
export const MUTATION_CREATE_PROJECT_NOTIFY_RULE = `
  mutation ( $input: CreateProjectNotificationsRuleInput! ){
    createProjectNotificationsRule(
      input: $input
    ) {
      ...ProjectNotificationsRule
    }
  }

  ${PROJECT_NOTIFICATIONS_RULE_FRAGMENT}
`;

// language=GraphQL
export const MUTATION_UPDATE_PROJECT_NOTIFY_RULE = `
  mutation ( $input: UpdateProjectNotificationsRuleInput! ){
    updateProjectNotificationsRule(
      input: $input
    ) {
      ...ProjectNotificationsRule
    }
  }

  ${PROJECT_NOTIFICATIONS_RULE_FRAGMENT}
`;

// language=GraphQL
export const MUTATION_REMOVE_PROJECT = `
  mutation removeProject($projectId: ID!) {
    removeProject(projectId: $projectId)
  }
`;

// language=GraphQL
export const MUTATION_TOGGLE_ENABLED_STATE_OF_A_PROJECT_NOTIFY_RULE = `
  mutation ( $input: ProjectNotificationRulePointer! ){
    toggleProjectNotificationsRuleEnabledState(
      input: $input
    ) {
      ...ProjectNotificationsRule
    }
  }

  ${PROJECT_NOTIFICATIONS_RULE_FRAGMENT}
`;


// language=GraphQL
/**
 * Get data for chart
 */
export const QUERY_CHART_DATA = `
  query ProjectChartData (
    $projectId: ID!,
    $since: Int!
  ) {
    project(id: $projectId) {
      chartData(since: $since) {
        timestamp
        totalCount
      }
    }
  }
`;
