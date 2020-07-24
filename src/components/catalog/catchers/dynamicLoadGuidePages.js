let component;

export default {
  /**
   * Vue router navigation guard. Using for fetching instruction page
   *
   * @param {Route} to - route to which the user goes
   * @param {Route} _from - the route from which the user goes
   * @param {Function} next - next router guard
   */
  async beforeRouteEnter(to, _from, next) {
    component = (await import(/* webpackChunkName: 'catcher-instructions-[request]' */ './guides/' + to.params.page)).default;
    next();
  },
  render: h => h(component),
};
