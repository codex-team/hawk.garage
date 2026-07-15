import { getDemoNotifications } from './notificationsState';

export default function mockFetchNotificationsSettings() {
  return {
    notifications: getDemoNotifications(),
  };
}
