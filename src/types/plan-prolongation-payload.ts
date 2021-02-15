/**
 * Data to be sent with pay event to and back from payments server
 */
export interface PlanProlongationPayload {
  /**
   * Workspace Identifier
   */
  workspaceId: string;

  /**
   * Tariff plan which user pays for
   */
  tariffId: string;

  /**
   * Hash to check data
   */
  checksum: string;
}
