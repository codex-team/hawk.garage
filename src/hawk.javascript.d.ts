/**
 * Temporary solution for fix error with types in hawk.javascript
 */
declare module 'hawk.javascript' {
  /**
   * Hawk JavaScript Catcher
   * Module for errors and exceptions tracking
   */
  export default class HawkCatcher {
    constructor(settings: any);

    /**
     * Send test error
     */
    public test(): void;
  }
}
