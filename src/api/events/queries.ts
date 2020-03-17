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
        label
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
          visitedBy
          label
          catcherType
          payload {
            timestamp
            title
          }
        }
        dailyInfo {
          groupHash
          count
          date
          lastRepetitionId
          timestamp
        }
      }
    }
  }

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

// language
/**
 * GraphQL Mutation to set label to event for current user
 */
export const MUTATION_MARK_EVENT = `
  mutation markEvent($projectId: ID!, $eventId: ID!, $label: EventLabel!) {
    markEvent(project: $projectId, id: $eventId, label: $label)
  }
`;
