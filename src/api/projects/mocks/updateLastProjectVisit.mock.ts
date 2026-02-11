/**
 * Mock for updateLastProjectVisit API function
 * Returns success status for updating last project visit timestamp
 */
export default async function updateLastProjectVisitMock(projectId: string): Promise<boolean> {
  // Always return true in demo mode - no actual tracking needed
  return true;
}
