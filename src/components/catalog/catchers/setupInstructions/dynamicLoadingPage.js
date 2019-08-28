let component;

export default {
  async beforeRouteEnter(to, from, next) {
    component = (await import('./' + to.params.page)).default;
    next();
  },
  render: h => h(component)
};
