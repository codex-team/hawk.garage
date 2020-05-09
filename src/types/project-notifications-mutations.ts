import { ReceiveTypes } from './project-notifications';
import {NotificationsChannels} from './notifications';

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

/**
 * What kind of data we send to update the specific notifications rule
 */
export interface ProjectNotificationsUpdateRulePayload extends ProjectNotificationsAddRulePayload {
  /**
   * Rule id to update
   */
  ruleId: string;

  /**
   * True if settings is enabled
   */
  isEnabled: boolean;
}

/**
 * This payload used to determine specific rule for deletion or toggling isEnabled state
 */
export interface ProjectNotificationRulePointer {
  /**
   * In which project we adding a rule
   */
  projectId: string;

  /**
   * Rule id to update
   */
  ruleId: string;
}
