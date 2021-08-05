/**
 * Type of notifier action
 */
export enum NotifierActionType {
  /**
   * Confirm action
   */
  CONFIRM = 'CONFIRM',

  /**
   * Notify action
   */
  NOTIFY = 'NOTIFY'
}

export interface NotifierButton {
  /**
   * Text in notifier button
   */
  notifierButtonText: string;

  /**
   * callback when user clicks notifier button
   */
  onConfirm: () => {};
}

/**
 * Options for creating confirmation window
 */
export interface NotifierWindowOptions {
  /**
   * Description of notifier window
   */
  description: string;

  /**
   * Type of notifier action
   */
  actionType: NotifierActionType;

  /**
   * Notifier Buttons
   */
  notifierButtons?: NotifierButton[];
}
