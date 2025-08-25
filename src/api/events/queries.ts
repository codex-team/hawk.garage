import { EVENT_FRAGMENT } from '../fragments';

// language=GraphQL
/**
 * Get specific error
 */
export const QUERY_EVENT = `
  query Event($projectId: ID!, $eventId: ID!, $originalEventId: ID!) {
    project(projectId: $projectId) {
      event(eventId: $eventId, originalEventId: $originalEventId) {
        ...Event
      }
    }
  }

  ${EVENT_FRAGMENT}
`;

export const QUERY_PROJECT_DAILY_EVENTS = `
  query ProjectDailyEvents(
    $projectId: ID!
    $cursor: DailyEventsCursorInput
    $sort: EventsSortOrder
    $filters: EventsFiltersInput
    $search: String
  ) {
    project(projectId: $projectId) {
      dailyEventsPortion(sort: $sort, filters: $filters, search: $search, nextCursor: $cursor) {
        nextCursor {
          groupingTimestampBound
          sortValueBound
          idBound
        }
        dailyEvents {
          id
          count
          affectedUsers
          groupingTimestamp
          event {
            ...Event
          }
        }
      }
    }
  }
  
  ${EVENT_FRAGMENT}
`;

// language=GraphQL
/**
 * GraphQL query for latest repetitions
 *
 * @type {string}
 */
export const QUERY_EVENT_REPETITIONS_PORTION = `
  query LatestRepetitions(
    $projectId: ID!,
    $originalEventId: ID!,
    $limit: Int,
    $cursor: String
  ) {
    project(projectId: $projectId) {
      event(eventId: $originalEventId, originalEventId: $originalEventId) {
        repetitionsPortion(limit: $limit, cursor: $cursor) {
          nextCursor
          repetitions {
            ...Event
          }
        }
      }
    }
  }

  ${EVENT_FRAGMENT}
`;

// language=GraphQL
/**
 * Fetch data for chart
 * Display event occurs for few days
 */
export const QUERY_CHART_DATA = `
  query EventChartData (
    $projectId: ID!
    $originalEventId: ID!
    $days: Int!
    $timezoneOffset: Int!
  ) {
    project(projectId: $projectId) {
      event(eventId: $originalEventId, originalEventId: $originalEventId) {
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
  mutation visitEvent($projectId: ID!, $originalEventId: ID!) {
    visitEvent(projectId: $projectId, eventId: $originalEventId)
  }
`;

// language=GraphQL
/**
 * GraphQL Mutation to set mark to event for current user
 */
export const MUTATION_TOGGLE_EVENT_MARK = `
  mutation toggleEventMark($projectId: ID!, $eventId: ID!, $mark: EventMark!) {
    toggleEventMark(project: $projectId, eventId: $eventId, mark: $mark)
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
