/**
 * Get specific error
 */
export const QUERY_EVENT = `
  query Event($projectId: ID!, $eventId: ID!){
    event(projectId: $projectId, eventId: $eventId) {
      id
      catcherType
      count
      groupHash
      firstOccurence
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
          count
          payload {
            timestamp
            title
          }
        }
        dailyInfo {
          groupHash
          count
          date
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
