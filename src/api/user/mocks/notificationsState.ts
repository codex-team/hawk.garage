type DemoNotifications = {
  channels: {
    email: {
      isEnabled: boolean;
      endpoint: string;
    };
    webPush: {
      isEnabled: boolean;
      endpoint: string;
    };
    desktopPush: {
      isEnabled: boolean;
      endpoint: string;
    };
  };
  whatToReceive: {
    IssueAssigning: boolean;
    WeeklyDigest: boolean;
    SystemMessages: boolean;
  };
};

const initialNotifications: DemoNotifications = {
  channels: {
    email: {
      isEnabled: true,
      endpoint: 'demo@hawk.so',
    },
    webPush: {
      isEnabled: false,
      endpoint: '',
    },
    desktopPush: {
      isEnabled: false,
      endpoint: '',
    },
  },
  whatToReceive: {
    IssueAssigning: true,
    WeeklyDigest: true,
    SystemMessages: true,
  },
};

let demoNotifications: DemoNotifications = {
  channels: {
    ...initialNotifications.channels,
  },
  whatToReceive: {
    ...initialNotifications.whatToReceive,
  },
};

function cloneNotifications(): DemoNotifications {
  return {
    channels: {
      email: { ...demoNotifications.channels.email },
      webPush: { ...demoNotifications.channels.webPush },
      desktopPush: { ...demoNotifications.channels.desktopPush },
    },
    whatToReceive: {
      ...demoNotifications.whatToReceive,
    },
  };
}

export function getDemoNotifications(): DemoNotifications {
  return cloneNotifications();
}

export function updateDemoNotificationChannels(input: Partial<DemoNotifications['channels']>): DemoNotifications {
  demoNotifications = {
    ...demoNotifications,
    channels: {
      ...demoNotifications.channels,
      ...input,
    },
  };

  return cloneNotifications();
}

export function updateDemoNotificationReceiveTypes(
  input: Partial<DemoNotifications['whatToReceive']>
): DemoNotifications {
  demoNotifications = {
    ...demoNotifications,
    whatToReceive: {
      ...demoNotifications.whatToReceive,
      ...input,
    },
  };

  return cloneNotifications();
}
