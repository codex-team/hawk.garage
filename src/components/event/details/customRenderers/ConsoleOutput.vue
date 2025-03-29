<template>
  <div class="console-output">
    <div class="button-container" v-if="logs.length > 5">
      <button @click="expandedLogs = !expandedLogs" class="show-more-btn">
        <span class="log-arrow" :class="{ rotated: expandedLogs }">▲</span>
        {{
          expandedLogs
            ? $t("components.consoleOutput.hide_previous")
            : $t("components.consoleOutput.show_previous")
        }}
      </button>
    </div>
    <div
      v-for="log in displayedLogs"
      :key="log.timestamp"
      class="log-entry"
      :class="logClass(log.method)"
    >
      <div class="log-content">
        <span
          v-if="log.stack && log.stack.length > 0"
          class="log-arrow"
          @click="toggleStack(log.timestamp)"
        >
          <span :class="{ rotated: expandedStack[log.timestamp] }">▶</span>
        </span>
        <span class="log-message">
          <template v-if="log.type">
            {{ log.type !== "log" ? log.type + ": " : "" }}{{ log.message }}
          </template>
          <template v-else>
            {{ log.message }}
          </template>
        </span>
        <span class="log-timestamp">
          {{ formatTimestamp(log.timestamp) }}
        </span>
      </div>
      <div v-if="expandedStack[log.timestamp]" class="log-stack">
        {{ formatStack(log.stack) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "ConsoleOutput",
  props: {
    value: {
      type: [Object, Array] as PropType<Record<string, any> | any[]>,
      required: true,
    },
  },
  data() {
    return {
      expandedStack: {} as Record<string, boolean>,
      expandedLogs: false,
    };
  },
  computed: {
    logs() {
      return Object.values(this.value);
    },
    displayedLogs() {
      if (!this.expandedLogs && this.logs.length > 5) {
        return this.logs.slice(-5);
      }
      return this.logs;
    },
  },
  methods: {
    logClass(method: string): string {
      const logClasses: Record<string, string> = {
        error: "log-error",
        warn: "log-warn",
        info: "log-info",
        debug: "log-debug",
      };
      return logClasses[method?.toLowerCase()] || "log-default";
    },
    formatTimestamp(timestamp: string): string {
      const date = new Date(timestamp);
      const timeString = date.toLocaleTimeString(undefined, {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
      return `${timeString}:${milliseconds}`;
    },
    formatStack(stack: string | null | undefined): string {
      return stack?.trim() || "No stack trace available";
    },
    toggleStack(logKey: string) {
      this.$set(this.expandedStack, logKey, !this.expandedStack[logKey]);
    },
  },
});
</script>

<style scoped>
.console-output {
  padding: 10px;
  font-family: var(--font-monospace);
  font-size: 11px;
  --item-border-radius: 5px;
}

.log-entry {
  padding: 2px 4px;
  border-radius: var(--item-border-radius);
  white-space: pre-wrap;
  margin-bottom: 2px;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-second);
  color: var(--color-text-main);
  border-left: 3px solid color-mod(var(--color-text-main) alpha(10%));

  &.log-error {
    background: color-mod(var(--color-indicator-critical) alpha(15%));
    border-left-color: var(--color-indicator-critical-dark);
  }

  &.log-warn {
    background: color-mod(var(--color-indicator-warning) alpha(15%));
    color: var(--color-indicator-warning);
    border-left-color: var(--color-indicator-warning);
  }

  &.log-info {
    background: color-mod(var(--color-indicator-medium) alpha(15%));
    color: var(--color-indicator-medium);
    border-left-color: var(--color-indicator-medium-dark);
  }

  &.log-debug {
    background: color-mod(var(--color-indicator-positive) alpha(15%));
    color: var(--color-indicator-positive);
    border-left-color: var(--color-indicator-positive);
  }

  &.log-default {
    background: var(--color-bg-second);
    color: var(--color-text-main);
    border-left-color: color-mod(var(--color-text-main) alpha(10%));
  }
}

.log-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.log-arrow {
  padding: 0 4px;
  user-select: none;
  color: var(--color-text-second);
  transition: transform 0.2s ease-in-out;

  &:hover {
    color: var(--color-text-main);
  }

  .rotated {
    display: inline-block;
    transform: rotate(90deg);
  }
}

.log-message {
  flex-grow: 1;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.log-timestamp {
  color: var(--color-text-second);
  min-width: 93px;
  height: 21px;
  display: flex;
  align-items: center;
}

.log-stack {
  margin: 2px 0;
  padding: 3px 8px;
  border-radius: var(--item-border-radius);
  background: var(--color-bg-third);
  color: var(--color-text-main);
}

.button-container {
  height: 25px;
  display: flex;
  justify-content: center;
  margin-bottom: 2px;

  .show-more-btn {
    width: 100%;
    text-align: left;
    background-color: inherit;
    border: none;
    border-radius: var(--item-border-radius);
    color: var(--color-text-second);
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;

    &:hover {
      background-color: var(--color-bg-second);
    }

    &:focus {
      outline: none;
    }

    span {
      display: inline-block;
      color: var(--color-text-second);
      margin-right: 8px;

      &.rotated {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
