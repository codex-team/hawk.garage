/**
 * Tell the TypeScript compiler (and the IDE) how to handle .vue files
 */
declare module '*.vue' {
  import Vue = require('vue');
  const value: Vue.ComponentOptions<Vue>;

  export default value;
}

/**
 * Extend ImportMeta for Vite's import.meta.glob feature
 */
interface ImportMeta {
  glob: (pattern: string) => Record<string, () => Promise<unknown>>;
}
