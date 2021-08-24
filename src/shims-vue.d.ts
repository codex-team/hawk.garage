/**
 * Tell the TypeScript compiler (and the IDE) how to handle .vue files
 */
declare module '*.vue' {
  import Vue = require('vue');
  const value: Vue.ComponentOptions<Vue>;
  export default value;
}