import { PROJECT_NOTIFICATIONS_RULE_FRAGMENT } from '../fragments';

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
      notifications {
        ...ProjectNotificationsRule
      }
    }
  }

  ${PROJECT_NOTIFICATIONS_RULE_FRAGMENT}
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
 * Mutation for updating project rate limits settings
 */
export const MUTATION_UPDATE_PROJECT_RATE_LIMITS = `
    mutation updateProjectRateLimits(
        $id: ID!
        $rateLimitSettings: RateLimitSettingsInput
    ) {
        updateProjectRateLimits(
            id: $id,
            rateLimitSettings: $rateLimitSettings
        ) {
            rateLimitSettings {
                N
                T
            }
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
export const MUTATION_UPDATE_LAST_VISIT = `
    mutation lastProjectVisit($projectId: ID!) {
        updateLastProjectVisit(projectId: $projectId)
    }
`;

// language=GraphQL
export const MUTATION_CREATE_PROJECT_NOTIFY_RULE = `
  mutation createProjectNotificationsRule( $input: CreateProjectNotificationsRuleInput! ){
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
  mutation updateProjectNotificationsRule( $input: UpdateProjectNotificationsRuleInput! ){
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
  mutation removeProjectNotificationsRule( $input: ProjectNotificationRulePointer! ) {
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
  mutation createProjectEventGroupingPattern( $input: CreateProjectEventGroupingPatternInput! ){
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
  mutation updateProjectEventGroupingPattern( $input: UpdateProjectEventGroupingPatternInput! ){
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
  mutation removeProjectEventGroupingPattern( $input: RemoveProjectEventGroupingPatternInput! ){
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
  mutation toggleProjectNotificationsRuleEnabledState( $input: ProjectNotificationRulePointer! ){
    toggleProjectNotificationsRuleEnabledState(
      input: $input
    ) {
      ...ProjectNotificationsRule
    }
  }

  ${PROJECT_NOTIFICATIONS_RULE_FRAGMENT}
`;

// language=GraphQL
export const MUTATION_UNSUBSCRIBE_FROM_NOTIFICATIONS = `
  mutation unsubscribeFromNotifications( $input: ProjectNotificationRulePointer! ){
    unsubscribeFromNotifications(
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

// language=GraphQL
/**
 * Get project releases
 */
export const QUERY_PROJECT_RELEASES = `
  query ProjectReleases($projectId: ID!) {
    project(projectId: $projectId) {
      releases {
        release
        timestamp
        newEventsCount
        commitsCount
        filesCount
      }
    }
  }
`;

// language=GraphQL
/**
 * Get project release details
 */
export const QUERY_PROJECT_RELEASE_DETAILS = `
  query ProjectReleaseDetails($projectId: ID!, $release: String!) {
    project(projectId: $projectId) {
      releaseDetails(release: $release) {
        release
        commitsCount
        filesCount
        timestamp
        files {
          mapFileName
          originFileName
          length
        }
        commits { hash author title date }
        dailyEventsPortion(limit: 50, release: $release) {
          dailyEvents {
            id
            count
          }
        }
      }
    }
  }
`;
