module.exports = {
  signUp: { // params for sign-up route
    viewPath: 'auth/sign-up', // path to view
    email: {
      subject: 'Welcome to Hawk.so',
      templatePath: 'notifies/email/join',
      renderParams: {
        settingsLink: process.env.SERVER_URL + '/garage/settings'
      }
    },
    redirect: '/garage'
  }
};
