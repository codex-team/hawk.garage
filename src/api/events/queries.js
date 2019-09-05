// language=GraphQL
/**
 * Get specific error
 */
export const QUERY_EVENT = `
  query Event($projectId: ID!, $eventId: ID!){
    project(id: $projectId) {
      event(id: $eventId) {
        id
        catcherType
        totalCount
        groupHash
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
            line
            sourceCode {
              line
              content
            }
            file
          }
        }
      }
    }

  }
`;

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
          payload {
            timestamp
            title
          }
        }
        dailyInfo {
          groupHash
          count
          date
          timestamp
        }
      }
    }
  }

`;

/**
 * GraphQL query for latest repetitions
 * @type {string}
 */
// language=GraphQL
export const QUERY_LATEST_REPETITION = `
  query LatestRepetition(
    $projectId: ID!,
    $eventId: ID!,
    $limit: Int
  ) {
    project(id: $projectId){
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
          }
        }
      }
    }
  }
`;
