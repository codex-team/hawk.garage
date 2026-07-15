import { updateDemoNotificationChannels } from './notificationsState';

type NotificationsChannelInput = {
  input?: {
    email?: { endpoint: string; isEnabled: boolean };
    webPush?: { endpoint: string; isEnabled: boolean };
    desktopPush?: { endpoint: string; isEnabled: boolean };
  };
};

export default function mockUpdateNotificationsChannel(payload: NotificationsChannelInput = {}) {
  return {
    notifications: updateDemoNotificationChannels(payload.input || {}),
  };
}
