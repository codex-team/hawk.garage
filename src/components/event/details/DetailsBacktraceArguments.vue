<template>
  <div class="args">
    <div
      v-for="(item, row) in argsList"
      :key="`row:${row}`"
      class="args__row"
    >
      <div class="args__key">
        {{ item.key }}
      </div>
      <div class="args__value">
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

/**
 * Describes a parsed argument row.
 */
interface ArgsRow {
  /**
   * Argument key.
   */
  key: string;

  /**
   * Argument value.
   */
  value: string;
}

/**
 * Max length for argument values displayed in the table.
 */
const MAX_ARGUMENT_VALUE_LENGTH = 2000;

/**
 * @param value - argument value
 * @returns {string} value truncated to {@link MAX_ARGUMENT_VALUE_LENGTH} characters
 */
function truncateArgumentValue(value: string): string {
  if (value.length <= MAX_ARGUMENT_VALUE_LENGTH) {
    return value;
  }

  return `${value.slice(0, MAX_ARGUMENT_VALUE_LENGTH)}…`;
}

export default defineComponent({
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
     * Transforms string-like format of args to the list of rows
     */
    argsList(): ArgsRow[] {
      const list: ArgsRow[] = [];
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

          list.push({
            key: rawKey,
            value: truncateArgumentValue(rawValue),
          });
        }
      });

      return list;
    },
  },
});
</script>

<style scoped>
.args {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin-top: 8px;
  margin-right: auto;
  margin-bottom: 8px;
  color: var(--color-text-second);
  font-size: 11px;
  font-family: var(--font-monospace);
  line-height: 1.45em;
}

.args__row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  min-width: 0;
}

.args__key {
  flex-shrink: 0;
  white-space: nowrap;
}

.args__value {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
  white-space: normal;
}
</style>
