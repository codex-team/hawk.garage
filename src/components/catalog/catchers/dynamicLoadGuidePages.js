import { h, defineComponent, markRaw } from 'vue';
import commonGuide from './guides/common.vue';
import javascriptGuide from './guides/javascript.vue';
import sentryGuide from './guides/sentry.vue';

/**
 * Map of guide components by route parameter
 */
const guideComponents = {
  common: commonGuide,
  javascript: javascriptGuide,
  sentry: sentryGuide,
};

export default defineComponent({
  /**
   * Vue router navigation guard. Using for fetching instruction page
   *
   * @param {Route} to - route to which the user goes
   * @param {Route} _from - the route from which the user goes
   * @param {Function} next - next router guard
   */
  beforeRouteEnter(to, _from, next) {
    const hasSeparatePage = [
      'javascript',
      'sentry',
    ];

    const view = hasSeparatePage.includes(to.params.page) ? to.params.page : 'common';
    const loadedComponent = guideComponents[view] || guideComponents.common;

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
