module.exports = {
  routePrefix: '/', // ex: if / => route is /sign-up, if /auth => route is /auth/sign-up
  signUp: { // params for sign-up route
    viewPath: 'auth/sign-up', // path to view
    redirectIfAuthed: '/garage', // if user is already authed redirect to this page
    redirectIfRegistrationSuccessful: '/login' // if user registration is successful redirect to this page
  }
};
