import { USER_FRAGMENT, EVENT_BACKTRACE } from '../fragments';

// language=GraphQL
/**
 * Get specific error
 */
export const QUERY_EVENT = `
  query Event($projectId: ID!, $eventId: ID!, $repetitionId: ID) {
    project(id: $projectId) {
      event(id: $eventId) {
        id
        catcherType
        totalCount
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
          title
          type
          release
          timestamp
          context
          user {
            id
            name
            photo
          }
          get
          backtrace {
            ...eventBacktrace
          }
          addons
        }
        usersAffected
        repetition(id: $repetitionId) {
          id
          payload {
            release
            timestamp
            context
            user {
              id
              name
              photo
            }
            get
            backtrace {
              ...eventBacktrace
            }
            addons
          }
        }
        release {
          releaseName
          commits{
            hash
            author
            title
            date
          }
        }
      }
    }
  }

  ${USER_FRAGMENT}

  ${EVENT_BACKTRACE}
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
    $filters: EventsFiltersInput
  ) {
    project(id: $projectId) {
      recentEvents(limit: 15, skip: $skip, sort: $sort, filters: $filters) {
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
          payload {
            timestamp
            title
          }
        }
        dailyInfo {
          groupHash
          count
          groupingTimestamp
          lastRepetitionId
          lastRepetitionTime
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
    $eventId: ID!,
    $skip: Int,
    $limit: Int
  ) {
    project(id: $projectId) {
      event(id: $eventId) {
        repetitions(skip: $skip, limit: $limit) {
          id
          payload {
            title,
            release
            timestamp
            context
            user {
              id
              name
              photo
            }
            get
            backtrace {
              line
              sourceCode {
                line
                content
              }
              file
            }
            addons
          }
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
    project(id: $projectId) {
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
 * Fetch data for affected users chart
 */
export const QUERY_AFFECTED_USERS_CHART_DATA = `
  query EventAffectedUsersChartData (
    $projectId: ID!
    $eventId: ID!
    $days: Int!
    $timezoneOffset: Int!
  ) {
    project(id: $projectId) {
      event(id: $eventId) {
        affectedUsersChartData(
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
  mutation visitEvent($projectId: ID!, $eventId: ID!) {
    visitEvent(project: $projectId, id: $eventId)
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
