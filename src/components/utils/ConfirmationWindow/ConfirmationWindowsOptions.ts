/**
 * Options for creating confirmation window
 */
export default interface ConfirmationWindowOptions {
  /**
   * Confirmation window title
   */
  title?: string;

  /**
   * Description of confirming action
   */
  description?: string;

  /**
   * Text in continue button
   */
  continueButtonText?: string;

  /**
   * onConfirm callback when user clicks continue button
   */
  onConfirm?: () => {};

  /**
   * Type of confirmation action
   */
  actionType: 'submit' | 'deletion';
}
