<template>
  <div v-if="isConsoleOutput">
    <div
      v-for="(log, index) in logs"
      :key="index"
      class="log-entry"
      :class="logClass(log.method)"
    >
      <div class="log-content">
        <!-- Stack toggle arrow (only if stack exists) -->
        <span v-if="log.stack" class="log-arrow" @click="toggleStack(index)">
          <span :class="{ rotated: expandedStack[index] }">▶</span>
        </span>

        <!-- Log message -->
        <span class="log-message">
          <template v-if="log.method && log.method.toLowerCase() === 'log'">
            {{ log.message }}
          </template>
          <template v-else-if="log.type">
            {{ log.type }}: {{ log.message }}
          </template>
          <template v-else>
            {{ log.message }}
          </template>
        </span>

        <!-- Timestamp -->
        <span class="log-timestamp">
          {{ formatTimestamp(log.timestamp) }}
        </span>
      </div>

      <!-- Stack trace (collapsible) -->
      <div v-if="expandedStack[index]" class="log-stack">
        {{ formatStack(log.stack) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ConsoleOutput",
  props: {
    logs: {
      type: Object,
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
     * Check if provided data represents console logs
     */
    isConsoleOutput(): boolean {
      return Object.values(this.logs).every(
        (log: any) => log && log.method && log.message && log.timestamp
      );
    },
  },
  methods: {
    /**
     * Returns CSS class based on log method
     */
    logClass(method: string): string {
      const logClasses = new Map<string, string>([
        ["error", "log-error"],
        ["warn", "log-warn"],
        ["info", "log-info"],
        ["debug", "log-debug"],
      ]);

      return logClasses.get(method?.toLowerCase()) || "log-default";
    },

    /**
     * Formats timestamp with milliseconds
     */
    formatTimestamp(timestamp: string): string {
      const date = new Date(timestamp);
      return date.toLocaleTimeString(undefined, {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
      });
    },

    /**
     * Toggle stack trace visibility
     */
    toggleStack(index: number) {
      this.$set(this.expandedStack, index, !this.expandedStack[index]);
    },

    /**
     * Trim unnecessary blank lines from stack trace
     */
    formatStack(stack: string): string {
      return stack.trim();
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
