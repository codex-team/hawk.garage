import Vue from 'vue';

/**
 * Augment Vue type with custom $sendToHawk method specified in {@link ./../main}
 */
declare module 'vue/types/vue' {
  interface Vue {
    /**
     * Sends error to the Hawk
     *
     * @param {Error} error - error to send
     * @example this.$sendToHawk(new Error('Some error'));
     */
    $sendToHawk: (error: Error) => void;
  }
}
