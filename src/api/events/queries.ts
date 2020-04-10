import { USER_FRAGMENT, EVENT_BACKTRACE } from '../fragments';

// language=GraphQL
/**
 * Get data for chart
 */
export const QUERY_CHART_DATA = `
  query ProjectRecentEvents (
    $projectId: ID!,
  ) {
    project(id: $projectId) {
      recentEvents(limit: 20, skip: 0) {
        dailyInfo {
          count
          groupingTimestamp
        }
      }
    }
  }
`

// language=GraphQL
/**
 * Get specific error
 */
export const QUERY_EVENT = `
  query Event($projectId: ID!, $eventId: ID!, $repetitionId: ID){
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
    $skip: Int!
  ) {
    project(id: $projectId) {
      recentEvents(limit: 15, skip: $skip) {
        events {
          id
          groupHash
          totalCount
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
 * @type {string}
 */
export const QUERY_LATEST_REPETITIONS = `
  query LatestRepetitions(
    $projectId: ID!,
    $eventId: ID!,
    $limit: Int
  ) {
    project(id: $projectId) {
      event(id: $eventId) {
        repetitions(limit: $limit) {
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
