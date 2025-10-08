import clickOutside from './clickOutside';
import copyable from './copyable';
import infiniteScroll from 'vue-infinite-scroll';


export default function setupDirectives(app) {
  // Регистрируем плагин infinite scroll
  app.use(infiniteScroll);
  
  // Регистрируем кастомные директивы
  app.directive('click-outside', clickOutside);
  app.directive('copyable', copyable);
}
