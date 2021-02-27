/**
 * Data required for payment
 */
export interface PlanProlongationPayload {
  /**
   * Workspace Identifier
   */
  workspaceId: string;

  /**
   * Id of the user making the payment
   */
  userId: string;

  /**
   * Workspace current plan id or plan id to change
   */
  tariffPlanId: string;
}
