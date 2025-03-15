<template>
  <div class='console-output'>
    <div
      v-for='(log, index) in logs'
      :key='index'
      class='log-entry'
      :class='logClass(log.method)'
    >
      <div class='log-content'>
        <!-- Stack toggle arrow (only if stack exists and is not empty) -->
        <span v-if='log.stack && log.stack.length > 0' class='log-arrow' @click='toggleStack(index)'>
          <span :class='{ rotated: expandedStack[index] }'>▶</span>
        </span>

        <!-- Log message -->
        <span class='log-message'>
          <template v-if='log.type'>
            {{ log.type }}: {{ log.message }}
          </template>
          <template v-else>
            {{ log.message }}
          </template>
        </span>

        <!-- Timestamp -->
        <span class='log-timestamp'>
          {{ formatTimestamp(log.timestamp) }}
        </span>
      </div>

      <!-- Collapsible stack trace -->
      <div v-if='expandedStack[index]' class='log-stack'>
        {{ formatStack(log.stack) }}
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue, { PropType } from 'vue';

/**
 * Custom Renderer for Console Output
 */
export default Vue.extend({
  name: 'ConsoleOutput',
  props: {
    /**
     * Console logs object
     */
    value: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
  },
  data() {
    return {
      expandedStack: {} as Record<number, boolean>,
    };
  },
  computed: {
    /**
     * Extract logs array from object
     */
    logs(): any[] {
      return Object.values(this.value);
    },
  },
  methods: {
    /**
     * Returns CSS class based on log method
     */
    logClass(method: string): string {
      const logClasses: Record<string, string> = {
        error: 'log-error',
        warn: 'log-warn',
        info: 'log-info',
        debug: 'log-debug',
      };
      return logClasses[method?.toLowerCase()] || 'log-default';
    },

    /**
     * Formats timestamp with milliseconds
     */
    formatTimestamp(timestamp: string): string {
      const date = new Date(timestamp);
      const options: Intl.DateTimeFormatOptions = {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };

      if ('fractionalSecondDigits' in Intl.DateTimeFormat.prototype) {
        options.fractionalSecondDigits = 3;
      }

      return date.toLocaleTimeString(undefined, options);
    },

    /**
     * Toggle stack trace visibility
     */
    toggleStack(index: number) {
      this.$set(this.expandedStack, index, !this.expandedStack[index]);
    },

    /**
     * Format stack trace by removing unnecessary blank lines
     */
    formatStack(stack: string | null | undefined): string {
      return stack?.trim() || 'No stack trace available';
    },
  },
});
</script>

<style scoped>
/* General log entry container */
.log-entry {
  font-family: var(--font-monospace);
  padding: 2px 4px;
  border-radius: 5px;
  white-space: pre-wrap;
  margin-bottom: 2px;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-second);
  color: var(--color-text-main);
  border-left: 3px solid color-mod(var(--color-text-main) alpha(10%));
}
/* Log content: arrow, message, timestamp */
.log-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
/* Stack toggle arrow */
.log-arrow {
  padding: 0 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  color: var(--color-text-second);
  transition: transform 0.2s ease-in-out;
  &:hover {
    opacity: 0.6;
  }
}
.log-arrow.rotated {
  transform: rotate(90deg);
}
/* Log message */
.log-message {
  flex-grow: 1;
  color: var(--color-text-main);
}
/* Timestamp */
.log-timestamp {
  color: var(--color-text-second);
  font-size: 10px;
  margin-left: 10px;
}
/* Collapsible stack trace */
.log-stack {
  font-size: var(--font-small);
  margin: 2px 0;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--color-bg-third);
  color: var(--color-text-main);
}
/* Log colors */
.log-error {
  background: color-mod(var(--color-indicator-critical) alpha(15%));
  color: var(--color-indicator-critical);
  border-left-color: var(--color-indicator-critical-dark);
}
.log-warn {
  background: color-mod(var(--color-indicator-warning) alpha(15%));
  color: var(--color-indicator-warning);
  border-left-color: var(--color-indicator-warning);
}
.log-info {
  background: color-mod(var(--color-indicator-medium) alpha(15%));
  color: var(--color-indicator-medium);
  border-left-color: var(--color-indicator-medium-dark);
}
.log-debug {
  background: color-mod(var(--color-indicator-positive) alpha(15%));
  color: var(--color-indicator-positive);
  border-left-color: var(--color-indicator-positive);
}
.log-default {
  background: var(--color-bg-second);
  color: var(--color-text-main);
  border-left-color: color-mod(var(--color-text-main) alpha(10%));
}
</style>
