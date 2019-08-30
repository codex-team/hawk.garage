// language=GraphQL
/**
 * Get specific error
 */
export const QUERY_EVENT = `
  query Event($projectId: ID!, $eventId: ID!){
    event(projectId: $projectId, eventId: $eventId) {
      id
      catcherType
      payload {
        title
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

// language=GraphQL
export const QUERY_RECENT_PROJECT_EVENTS = `
  query ProjectRecentEvents (
    $projectId: ID!
  ) {
    project(id: $projectId) {
      id
      recentEvents(limit: 30) {
        events {
          id
          groupHash
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
