import { ReceiveTypes, NotificationsChannels } from './project-notifications';

/**
 * What kind of data we send to create a new notifications rule in a project
 */
export interface ProjectNotificationsAddRulePayload {
  /**
   * In which project we adding a rule
   */
  projectId: string;

  /**
   * Receive type: 'ALL'  or 'ONLY_NEW'
   */
  whatToReceive: ReceiveTypes;

  /**
   * Only those which contains passed words
   */
  including: string[];

  /**
   * Skip those which contains passed words
   */
  excluding: string[];

  /**
   * Available channels to receive
   */
  channels: NotificationsChannels;
}
