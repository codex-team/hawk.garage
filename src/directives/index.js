import clickOutside from './clickOutside';
import copyable from './copyable';
import infiniteScroll from './infiniteScroll';

/**
 * Setup custom directives
 *
 * @param {App} app - Vue application instance
 */
export default function setupDirectives(app) {
  /**
   * Register infinite scroll directive (Vue 3 compatible)
   */
  app.directive('infinite-scroll', infiniteScroll);

  /**
   * Register click outside directive
   */
  app.directive('click-outside', clickOutside);
  app.directive('copyable', copyable);
}
