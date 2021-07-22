/**
 * Type of confirmation action
 */
export enum NotifierActionType {
  /**
   * Submit action
   */
  SUBMIT = 'SUBMIT',

  /**
   * Deletion action
   */
  DELETION = 'DELETION'
}

/**
 * Options for creating confirmation window
 */
export interface NotifierWindowOptions {
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
  actionType: NotifierActionType;
}
