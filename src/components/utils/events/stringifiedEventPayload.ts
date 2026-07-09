import { isObject } from '@/utils';

import type { HawkEventBacktraceFrame, HawkEventPayload } from '@/types/events';
import type { EventAddons } from '@hawk.so/types';

/**
 * Traverses the passed object and builds a formatted string representation
 * @param obj - Object
 * @returns Formatted object string, or `null` if the value is not an object
 */
function buildObjectString(obj: object): string | null {
  if (!isObject(obj)) {
    return null;
  }

  const lineArray: string[] = [];

  const traverse = (node: object, level: number = 0): void => {
    Object.entries(node).forEach(([key, value]) => {
      const prefix = '  '.repeat(level);

      if (Array.isArray(value)) {
        lineArray.push(`${prefix}${key}: [`);
        value.forEach((el, index) => {
          const itemPrefix = '  '.repeat(level + 1);
          const suffix = index !== value.length - 1 ? ',' : '';

          if (isObject(el)) {
            lineArray.push(`${itemPrefix}{`);
            traverse(el as object, level + 2);
            lineArray.push(`${itemPrefix}}${suffix}`);
          } else {
            lineArray.push(`${itemPrefix}${String(el)}${suffix}`);
          }
        });
        lineArray.push(`${prefix}]`);
      } else if (isObject(value)) {
        lineArray.push(`${prefix}${key}: {`);
        traverse(value as object, level + 1);
        lineArray.push(`${prefix}}`);
      } else {
        lineArray.push(`${prefix}${key}: ${String(value)}`);
      }
    });
  };

  traverse(obj);

  return lineArray.join('\n');
}

/**
 * Converts event addons into a formatted string
 *
 * Excludes ignored addon fields from the output
 * @param addons - Event payload addons
 * @returns Formatted addons string
 */
function buildAddonsString(addons: EventAddons): string | null {
  if (!addons) {
    return null;
  }

  const ignoredAddons = ['beautifiedUserAgent'];
  const filteredAddons = Object.fromEntries(
    Object.entries(addons).filter(([key]) => !ignoredAddons.includes(key))
  );

  return buildObjectString(filteredAddons);
}

/**
 * Converts a backtrace into a formatted string
 * @param backtrace - Event payload backtrace
 * @returns Formatted backtrace string, or `null` if the backtrace is empty
 */
function buildBacktraceString(backtrace: HawkEventBacktraceFrame[]): string | null {
  if (!backtrace || !backtrace.length) {
    return null;
  }

  return backtrace.map(({ function: func, file, line, column, sourceCode }) => {
    const parts: string[] = [
      func,
      `${file} line ${line}:${column}`,
    ];

    if (sourceCode?.length) {
      parts.push(
        sourceCode
          .map(({ line, content }) => `${line} ${content}`)
          .join('\n')
      );
    }

    return parts.join('\n');
  }).join('\n\n');
}

/**
 * Composes section string
 * @param title - Section name
 * @param content - Section content
 * @returns Formatted section string, or `null` if content is empty
 */
function buildSection(title: string, content: string | null | undefined): string | null {
  if (!content) {
    return null;
  }

  return `## ${title}\n\n${content}`;
}

/**
 * Converts an event payload into a formatted multiline string
 *
 * Includes information about title, backtrace, context, addons
 * @param payload - Event payload to stringify
 * @returns Formatted string representation of the event payload
 */
export function stringifyEventPayload(payload: HawkEventPayload): string {
  const sections = [
    buildSection('Title', payload.title),
    buildSection('Backtrace', buildBacktraceString(payload.backtrace)),
    buildSection('Context', buildObjectString(payload.context)),
    buildSection('Additional data', buildAddonsString(payload.addons)),
  ];

  return sections
    .filter(Boolean)
    .join('\n\n');
}
