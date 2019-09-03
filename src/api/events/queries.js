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
    $projectId: ID!
  ) {
    project(id: $projectId) {
      recentEvents(limit: 30) {
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

export const QUERY_REPETITION_LIST = `
  query repetitionsList(
    $projectId: ID!,
    $eventId: ID!
  ) {
    repetitions(projectId: $projectId, eventId: $eventId, limit: 30) {
      id
      catcherType
      payload {
         title
         timestamp
      }
    }
  } 
`;

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
