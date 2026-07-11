/**
 * Mock for updateLastProjectVisit API function
 * Returns success status for updating last project visit timestamp
 * @param _projectId - unused in demo mode
 */
export default async function updateLastProjectVisitMock(_projectId: string): Promise<boolean> {
  // Always return true in demo mode - no actual tracking needed
  return true;
}
