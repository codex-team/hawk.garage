import clickOutside from './clickOutside';
import copyable from './copyable';
import infiniteScroll from 'vue-infinite-scroll';

/**
 * Setup custom directives
 *
 * @param {App} app - Vue application instance
 */
export default function setupDirectives(app) {
  /**
   * Register infinite scroll plugin
   */
  app.use(infiniteScroll);

  /**
   * Register click outside directive
   */
  app.directive('click-outside', clickOutside);
  app.directive('copyable', copyable);
}
