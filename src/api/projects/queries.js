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
    project: createProject(name: $name, workspaceId: $workspaceId, image: $image) {
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
/**
 * Mutation for generating new integration token
 */
export const MUTATION_GENERATE_NEW_INTEGRATION_TOKEN = `
  mutation generateNewIntegrationToken(
    $id: ID!
  ) {
    generateNewIntegrationToken(id: $id)
    {
      record {
        token
      }
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
export const MUTATION_REMOVE_PROJECT_NOTIFY_RULE = `
  mutation ( $input: ProjectNotificationRulePointer! ) {
    deleteProjectNotificationsRule(
      input: $input
    ) {
      ...ProjectNotificationsRule
    }
  }

  ${PROJECT_NOTIFICATIONS_RULE_FRAGMENT}
`;

// language=GraphQL
export const MUTATION_CREATE_PROJECT_PATTERN = `
  mutation ( $input: CreateProjectEventGroupingPatternInput! ){
    createProjectEventGroupingPattern(
      input: $input
    ) {
      id
      pattern
    }
  }
`;

// language=GraphQL
export const MUTATION_UPDATE_PROJECT_PATTERN = `
  mutation ( $input: UpdateProjectEventGroupingPatternInput! ){
    updateProjectEventGroupingPattern(
      input: $input
    ) {
      id
      pattern
    }
  }
`;

// language=GraphQL
export const MUTATION_REMOVE_PROJECT_PATTERN = `
  mutation ( $input: RemoveProjectEventGroupingPatternInput! ){
    removeProjectEventGroupingPattern(
      input: $input
    ) {
      id
      pattern
    }
  }
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
  query ProjectRecentEvents (
    $projectId: ID!,
    $days: Int!
    $timezoneOffset: Int!
  ) {
    project(projectId: $projectId) {
      chartData(days: $days, timezoneOffset: $timezoneOffset) {
        timestamp
        count
      }
    }
  }
`;
