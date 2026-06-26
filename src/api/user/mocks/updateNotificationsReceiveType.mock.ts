import { updateDemoNotificationReceiveTypes } from './notificationsState';

type NotificationReceiveInput = {
  input?: {
    IssueAssigning?: boolean;
    WeeklyDigest?: boolean;
    SystemMessages?: boolean;
  };
};

export default function mockUpdateNotificationsReceiveType(payload: NotificationReceiveInput = {}) {
  return {
    notifications: updateDemoNotificationReceiveTypes(payload.input || {}),
  };
}
