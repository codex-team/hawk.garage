<template>
  <table class="args">
    <tr
      v-for="(item, row) in argsList"
      :key="`row:${row}`"
      class="args__row"
    >
      <template
        v-for="([key, value], col) in Object.entries(item)"
      >
        <td
          :key="`row:${row}:col:${col}:key`"
          class="args__key"
        >
          {{ key }}
        </td>
        <td
          :key="`row:${row}:col:${col}:value`"
          class="args__value"
        >
          {{ value }}
        </td>
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
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  computed: {
    /**
     * Transforms string-like format of args to object-like
     */
    argsList(): Record<string, string>[] {
      const list: Record<string, string>[] = [];

      this.args.map((item) => {
        /**
         * Case when argument passed as string like '"name"="value"'
         */
        if (typeof item === 'string' && item.includes('=')) {
          /**
           * Split 'name=value' to ['name', 'value']
           */
          const pair = item.split('=');

          list.push({
            [pair[0]]: pair[1],
          });
        } else {
          console.warn('Unsupported args format:', item);
        }
      });

      return list;
    },
  },
});
</script>

<style scoped>
.args {
  margin-top: 8px;
  margin-right: auto;
  margin-bottom: 8px;
  color: var(--color-text-second);
  font-size: 11px;
  font-family: var(--font-monospace);
  line-height: 1.45em;
  border-collapse: collapse;

  td {
    padding-right: 20px;
    vertical-align: top;
  }
}
</style>
