/**
 * Type of notifier button
 */
export enum NotifierButtonType {
  /**
   * Submit button
   */
  SUBMIT = 'SUBMIT',

  /**
   * Secondary button
   */
  SECONDARY = 'SECONDARY',

  /**
   * Warning button
   */
  WARNING = 'WARNING'
}

/**
 * Notifier button formate
 */
export interface NotifierButton {
  /**
   * Text in notifier button
   */
  buttonText: string;

  /**
   * notifier button type
   */
  buttonType: NotifierButtonType;

  /**
   * callback when user clicks notifier button
   */
  onConfirm: () => {};
}

/**
 * Options for creating notifier window
 */
export interface NotifierWindowOptions {
  /**
   * Description of notifier window
   */
  description: string;

  /**
   * Notifier window Buttons
   */
  notifierButtons?: NotifierButton[];
}
