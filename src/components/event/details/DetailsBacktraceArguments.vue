<template>
  <table class="args">
    <tr
      class="args__row"
      v-for="item in argsList"
    >
      <template
        v-for="[key, value] in Object.entries(item)"
      >
        <td class="args__key">{{ key }}</td>
        <td class="args__value">{{ value }}</td>
      </template>
    </tr>
  </table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'DetailsBacktraceArguments',
  props: {
    /**
     * Arguments for the stack trace frame
     */
    args: {
      type: Array as PropType<string[]>
    }
  },
  computed: {
    /**
     * Transforms string-like format of args to object-like
     */
    argsList(): Record<string, string>[] {
      return this.args.map( item => {
        /**
         * Case when argument passed as string like '"name"="value"'
         */
        if (typeof item === 'string' && item.includes('=')){
          /**
           * Split 'name=value' to ['name', 'value']
           */
          const pair = item.split('=')

          return {
            [pair[0]]: pair[1]
          }
        }

        return item;
      });
    }
  }
});
</script>

<style scoped>
.args {
  font-size: 11px;
  line-height: 1.45em;
  font-family: var(--font-monospace);
  border-collapse: collapse;
  margin-right: auto;
  margin-top: 8px;
  margin-bottom: 8px;
  color: var(--color-text-second);

  td {
    padding-right: 20px;
    vertical-align: top;
  }

  &__row {
  }

  &__key {
  }

  &__value {

  }
}
</style>
