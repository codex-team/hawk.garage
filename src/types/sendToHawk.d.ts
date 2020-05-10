/**
 * Augment Vue type with custom $sendToHawk method specified in {@link ./../main}
 */
import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * Sends error to the Hawk
     * @param {Error} error - error to send
     * @usage this.$sendToHawk(new Error('Some error'));
     */
    $sendToHawk: (error: Error) => void;
  }
}
