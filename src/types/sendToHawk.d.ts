
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue';

/**
 * Augment Vue type with custom $sendToHawk method specified in {@link ./../main}
 */
declare module 'vue/types/vue' {
  interface Vue {
    /**
     * Sends error to the Hawk
     *
     * @param error - error or message to send
     * @example this.$sendToHawk(new Error('Some error'));
     */
    $sendToHawk: (error: Error | string) => void;
  }
}
