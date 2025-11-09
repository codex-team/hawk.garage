<template>
  <table class="args">
    <tr
      v-for="(item, row) in argsList"
      :key="`row:${row}`"
      class="args__row"
    >
      <td
        v-for="(cell, col) in item"
        :key="`row:${row}:col:${col}`"
        :class="cell.className"
      >
        {{ cell.value }}
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

/**
 * Describes a cell to render in the arguments table.
 */
interface ArgsCell {
  /**
   * CSS class applied to the cell.
   */
  className: 'args__key' | 'args__value';
  /**
   * Display string for the cell.
   */
  value: string;
}

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
     * Transforms string-like format of args to the list of table cells
     */
    argsList(): ArgsCell[][] {
      const list: ArgsCell[][] = [];
      const args = this.args;

      args.forEach((item) => {
        /**
         * Case when argument passed as string like '"name"="value"'
         */
        if (typeof item === 'string' && item.includes('=')) {
          /**
           * Split 'name=value' to ['name', 'value']
           */
          const [rawKey, ...rawValueParts] = item.split('=');
          const rawValue = rawValueParts.join('=');

          list.push([
            {
              className: 'args__key',
              value: rawKey,
            },
            {
              className: 'args__value',
              value: rawValue,
            },
          ]);
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
