/**
 * Tell the TypeScript compiler (and the IDE) how to handle .vue files
 */
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
