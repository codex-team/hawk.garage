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
    redirect: '/garage',
    wrongEmailError: {
      viewPath: 'auth/sign-up',
      options: {
        message: {
          type: 'error',
          text: 'You typed invalid email. Please, try again.'
        }
      }
    },
    userExistsError: {
      viewPath: 'auth/sign-up',
      options: {
        message: {
          type: 'error',
          text: 'This email is already registered. Please, <a href="/login">login</a>.'
        }
      }
    }
  }
};
