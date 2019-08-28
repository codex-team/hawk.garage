let component;

export default {
  async beforeRouteEnter(to, from, next) {
    component = (await import(/* webpackChunkName: 'catcher-instructions-[request]' */ './setupInstructions/' + to.params.page)).default;
    next();
  },
  render: h => h(component)
};
