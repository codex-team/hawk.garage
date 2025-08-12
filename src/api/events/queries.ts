import { USER_FRAGMENT, EVENT_BACKTRACE, EVENT_FRAGMENT } from '../fragments';

// language=GraphQL
/**
 * Get specific error
 */
export const QUERY_EVENT = `
  query Event($projectId: ID!, $eventId: ID!, $repetitionId: ID) {
    project(projectId: $projectId) {
      event(id: $eventId) {
        ...Event
      }
    }
  }

  ${EVENT_FRAGMENT}
`;

// language=GraphQL
/**
 * Get project recent events
 */
export const QUERY_RECENT_PROJECT_EVENTS = `
  query ProjectRecentEvents (
    $projectId: ID!,
    $skip: Int!,
    $sort: EventsSortOrder,
    $filters: EventsFiltersInput,
    $search: String
  ) {
    project(projectId: $projectId) {
      recentEvents(limit: 15, skip: $skip, sort: $sort, filters: $filters, search: $search) {
        events {
          id
          groupHash
          totalCount
          assignee {
            id
            name
            email
            image
          }
          visitedBy {
           ...User
          }
          marks {
            resolved
            starred
            ignored
          }
          catcherType
          timestamp
          payload {
            title
          }
        }
        dailyInfo {
          groupHash
          count
          groupingTimestamp
          lastRepetitionId
          lastRepetitionTime
          affectedUsers
        }
      }
    }
  }

  ${USER_FRAGMENT}
`;

// language=GraphQL
/**
 * GraphQL query for latest repetitions
 *
 * @type {string}
 */
export const QUERY_LATEST_REPETITIONS = `
  query LatestRepetitions(
    $projectId: ID!,
    $groupHash: ID!,
    $limit: Int,
    $cursor: String
  ) {
    project(projectId: $projectId) {
      event(groupHash: $groupHash) {
        repetitions(limit: $limit, cursor: $cursor) {
          ...Event
        }
      }
    }
  }
`;

// language=GraphQL
/**
 * Fetch data for chart
 * Display event occurs for few days
 */
export const QUERY_CHART_DATA = `
  query EventChartData (
    $projectId: ID!
    $eventId: ID!
    $days: Int!
    $timezoneOffset: Int!
  ) {
    project(projectId: $projectId) {
      event(id: $eventId) {
        chartData(
          days: $days,
          timezoneOffset: $timezoneOffset
        ) {
          timestamp
          count
        }
      }
    }
  }
`;

// language=GraphQL
/**
 * GraphQL Mutation to mark event as visited
 */
export const MUTATION_VISIT_EVENT = `
  mutation visitEvent($projectId: ID!, $groupHash: ID!) {
    visitEvent(project: $projectId, groupHash: $groupHash)
  }
`;

// language=GraphQL
/**
 * GraphQL Mutation to set mark to event for current user
 */
export const MUTATION_TOGGLE_EVENT_MARK = `
  mutation toggleEventMark($projectId: ID!, $groupHash: ID!, $mark: EventMark!) {
    toggleEventMark(project: $projectId, groupHash: $groupHash, mark: $mark)
  }
`;

// language=GraphQL
/**
 * GraphQL Mutation to update an assignee to the event
 */
export const MUTATION_UPDATE_EVENT_ASSIGNEE = `
  mutation updateAssignee($input: UpdateAssigneeInput!) {
    events {
      updateAssignee(input: $input) {
        success
        record {
          id
          name
          email
          image
        }
      }
    }
  }
`;

// language=GraphQL
/**
 * GraphQL Mutation to remove an assignee from the event
 */
export const MUTATION_REMOVE_EVENT_ASSIGNEE = `
  mutation removeAssignee($input: RemoveAssigneeInput!) {
    events {
      removeAssignee(input: $input) {
        success
      }
    }
  }
`;
