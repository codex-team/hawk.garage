import { h, defineComponent, markRaw } from 'vue';

export default defineComponent({
  /**
   * Vue router navigation guard. Using for fetching instruction page
   *
   * @param {Route} to - route to which the user goes
   * @param {Route} _from - the route from which the user goes
   * @param {Function} next - next router guard
   */
  async beforeRouteEnter(to, _from, next) {
    const hasSeparatePage = [
      'javascript',
      'sentry',
    ];

    let view = 'common';

    if (hasSeparatePage.includes(to.params.page)) {
      view = to.params.page;
    }

    const loadedComponent = (await import(/* webpackChunkName: 'catcher-instructions-[request]' */ './guides/' + view)).default;

    next((vm) => {
      /**
       * Mark component as raw to avoid unnecessary reactivity overhead
       */
      vm.component = markRaw(loadedComponent);
    });
  },
  data() {
    return {
      component: null,
    };
  },
  render() {
    if (this.component) {
      return h(this.component);
    }

    return null;
  },
});
