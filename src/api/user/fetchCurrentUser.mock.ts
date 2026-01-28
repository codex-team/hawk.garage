/**
 * Mock response for fetchCurrentUser
 */
const mockCurrentUser = {
  data: {
    me: {
      id: '6215743cf3ff6b80215cb185',
      email: 'demo@hawk.com',
      name: 'Demo User',
      image: 'https://ui-avatars.com/api/?name=Demo+User&background=random',
      notifications: {
        channels: {
          email: true,
          slack: false,
          telegram: false,
        },
        receiveType: {
          onlyNew: false,
          onlyAssigned: false,
        },
      },
    },
  },
  errors: [],
};

export default mockCurrentUser;
