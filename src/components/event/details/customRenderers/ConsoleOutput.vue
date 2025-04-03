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
      v-for="(log, index) in displayedLogs"
      :key="`${log.timestamp}_${index}`"
      class="log-entry"
      :class="logClass(log.method)"
    >
      <div class="log-content">
        <span
          v-if="log.stack && log.stack.length > 0"
          class="log-arrow"
          @click="toggleStack(`${log.timestamp}_${index}`)"
        >
          <span :class="{ rotated: expandedStack[`${log.timestamp}_${index}`] }"
            >▶</span
          >
        </span>
        <span class="log-message" v-html="formatMessage(log)"></span>
        <span class="log-timestamp">
          {{ formatTimestamp(log.timestamp) }}
        </span>
      </div>
      <div v-if="expandedStack[`${log.timestamp}_${index}`]" class="log-stack">
        {{ formatStack(log.stack) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

interface ConsoleLogEvent {
  method: string;
  timestamp: string;
  type?: string;
  message: string;
  stack?: string;
  fileLine?: string;
  styles?: string[];
}

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
    logs(): ConsoleLogEvent[] {
      return Object.values(this.value);
    },
    displayedLogs(): ConsoleLogEvent[] {
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
    sanitizeHTML(str: string): string {
      // Replace special characters with their HTML entities
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
    formatMessage(log: ConsoleLogEvent): string {
      if (!log.message.includes("%c")) {
        return this.sanitizeHTML(log.message);
      }

      const parts = log.message.split("%c");
      const styles = log.styles || [];
      let result = "";

      parts.forEach((part, index) => {
        if (index === 0) {
          result += this.sanitizeHTML(part);
        } else {
          const style = styles[index - 1] || "";
          const sanitizedStyle = this.sanitizeStyle(style);
          result += `<span style="${sanitizedStyle}">${this.sanitizeHTML(
            part
          )}</span>`;
        }
      });

      return result;
    },
    sanitizeStyle(style: string): string {
      // List of allowed CSS properties
      const allowedProperties = [
        "color",
        "background-color",
        "font-weight",
        "font-style",
        "text-decoration",
        "font-size",
        "font-family",
      ];

      // List of allowed values for specific properties
      const allowedValues: Record<string, string[]> = {
        "font-weight": [
          "normal",
          "bold",
          "lighter",
          "bolder",
          "100",
          "200",
          "300",
          "400",
          "500",
          "600",
          "700",
          "800",
          "900",
        ],
        "font-style": ["normal", "italic", "oblique"],
        "text-decoration": ["none", "underline", "line-through", "overline"],
      };

      const sanitizedStyles = style
        .split(";")
        .map((prop) => {
          const [key, value] = prop.split(":").map((s) => s.trim());
          const normalizedKey = key.toLowerCase();

          if (allowedProperties.includes(normalizedKey)) {
            // Check values for properties with a limited set of allowed values
            if (allowedValues[normalizedKey]) {
              const normalizedValue = value.toLowerCase();
              if (allowedValues[normalizedKey].includes(normalizedValue)) {
                return `${key}: ${value}`;
              }
            } else {
              // For other properties, validate the value format
              if (
                normalizedKey === "color" ||
                normalizedKey === "background-color"
              ) {
                // Validate that the value is a valid color
                if (
                  /^#[0-9A-Fa-f]{3,6}$|^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$|^rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*[0-1](\.[0-9]+)?\)$|^[a-zA-Z]+$/.test(
                    value
                  )
                ) {
                  return `${key}: ${value}`;
                }
              } else if (normalizedKey === "font-size") {
                // Validate that the value is a valid font size
                if (/^\d+(\.\d+)?(px|em|rem|pt|%)$/.test(value)) {
                  return `${key}: ${value}`;
                }
              } else {
                // For other properties, just return the key-value pair
                return `${key}: ${value}`;
              }
            }
          }
          return "";
        })
        .filter(Boolean)
        .join("; ");

      return sanitizedStyles;
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
    cursor: pointer;
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
