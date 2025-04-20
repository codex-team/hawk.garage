<template>
  <div class="console-output">
    <div v-if="logs.length > 5" class="button-container">
      <button class="show-more-btn" @click="expandedLogs = !expandedLogs">
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
        <span class="log-message" v-html="formatMessage(log)" />
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
    /**
     * Returns the CSS class name for styling console log entries based on log level
     *
     * @param {string} method - The console method/log level ('error', 'warn', 'info', or 'debug')
     * @returns {string} The corresponding CSS class name for styling the log entry
     */
    logClass(method: string): string {
      const logClasses: Record<string, string> = {
        error: "log-error",
        warn: "log-warn",
        info: "log-info",
        debug: "log-debug",
      };

      return logClasses[method?.toLowerCase()] || "log-default";
    },
    /**
     * Formats a timestamp into a human-readable time string with milliseconds
     *
     * @param {string} timestamp - The timestamp to format
     * @returns {string} Formatted time string in HH:MM:SS:mmm format
     */
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
    /**
     * Formats a stack trace string, providing a fallback message if no trace is available
     *
     * @param {string | null | undefined} stack - The stack trace to format
     * @returns {string} Formatted stack trace or fallback message
     */
    formatStack(stack: string | null | undefined): string {
      return stack?.trim() || "No stack trace available";
    },
    /**
     * Toggles the visibility of the stack trace for a specific log entry
     *
     * @param {string} logKey - The unique identifier for the log entry
     */
    toggleStack(logKey: string) {
      this.$set(this.expandedStack, logKey, !this.expandedStack[logKey]);
    },
    /**
     * Sanitizes a string by replacing special HTML characters with their entities
     *
     * @param {string} str - The string to sanitize
     * @returns {string} The sanitized string with HTML entities
     */
    sanitizeHTML(str: string): string {
      // Replace special characters with their HTML entities
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
    /**
     * Formats a console log message with proper styling and sanitization
     *
     * @param {ConsoleLogEvent} log - The console log event to format
     * @returns {string} HTML-formatted and sanitized log message with applied styles
     */
    formatMessage(log: ConsoleLogEvent): string {
      // Add log type prefix except for regular console.log
      const prefix =
        log.method === "log" ? "" : `${log.type || log.method.toUpperCase()} `;

      if (!log.message.includes("%c")) {
        return this.sanitizeHTML(prefix + log.message);
      }

      const parts = log.message.split("%c");
      const styles = log.styles || [];
      let result = this.sanitizeHTML(prefix);

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
    /**
     * Sanitizes CSS styles by filtering allowed properties and values
     *
     * @param {string} style - The CSS style string to sanitize
     * @returns {string} Sanitized CSS style string containing only allowed properties and values
     */
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
  font-size: 11px;
  font-family: var(--font-monospace);
  --item-border-radius: 5px;
}

.log-entry {
  display: flex;
  flex-direction: column;
  margin-bottom: 2px;
  padding: 2px 4px;
  color: var(--color-text-main);
  white-space: pre-wrap;
  background: var(--color-bg-second);
  border-left: 3px solid color-mod(var(--color-text-main) alpha(10%));
  border-radius: var(--item-border-radius);

  &.log-error {
    background: color-mod(var(--color-indicator-critical) alpha(15%));
    border-left-color: var(--color-indicator-critical-dark);
  }

  &.log-warn {
    color: var(--color-indicator-warning);
    background: color-mod(var(--color-indicator-warning) alpha(15%));
    border-left-color: var(--color-indicator-warning);
  }

  &.log-info {
    color: var(--color-indicator-medium);
    background: color-mod(var(--color-indicator-medium) alpha(15%));
    border-left-color: var(--color-indicator-medium-dark);
  }

  &.log-debug {
    color: var(--color-indicator-positive);
    background: color-mod(var(--color-indicator-positive) alpha(15%));
    border-left-color: var(--color-indicator-positive);
  }

  &.log-default {
    color: var(--color-text-main);
    background: var(--color-bg-second);
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
  color: var(--color-text-second);
  transition: transform 0.2s ease-in-out;
  user-select: none;

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
  display: flex;
  align-items: center;
  min-width: 93px;
  height: 21px;
  color: var(--color-text-second);
}

.log-stack {
  margin: 2px 0;
  padding: 3px 8px;
  color: var(--color-text-main);
  background: var(--color-bg-third);
  border-radius: var(--item-border-radius);
}

.button-container {
  display: flex;
  justify-content: center;
  height: 25px;
  margin-bottom: 2px;

  .show-more-btn {
    display: flex;
    align-items: center;
    width: 100%;
    color: var(--color-text-second);
    text-align: left;
    background-color: inherit;
    border: none;
    border-radius: var(--item-border-radius);
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: var(--color-bg-second);
    }

    &:focus {
      outline: none;
    }

    span {
      display: inline-block;
      margin-right: 8px;
      color: var(--color-text-second);

      &.rotated {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
