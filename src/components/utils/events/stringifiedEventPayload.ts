import { isObject } from "@/utils";

import type { HawkEventBacktraceFrame, HawkEventPayload } from "@/types/events";
import type { EventAddons } from "@hawk.so/types";

export function stringifyEventPayload(payload: HawkEventPayload) {
  const sections = [
    buildSection("Title", payload.title),
    buildSection("Backtrace", buildBacktraceString(payload.backtrace)),
    buildSection("Context", buildObjectString(payload.context)),
    buildSection("Addons", buildAddonsString(payload.addons))
  ];

  return sections.join('\n\n');
};

function buildSection(title: string, content: string | null | undefined): string | null {
  if (!content) return null;

  return `### ${title} ###\n${content}`;
}

function buildBacktraceString(backtrace: HawkEventBacktraceFrame[]): string | null {
  if (!backtrace.length) {
    return null;
  }

  return backtrace.map(frame => {
    const frameString: string[] = [];
    frameString.push(frame.function);
    frameString.push(`${frame.file} line ${frame.line}:${frame.column}`);
    
    const stringifyedSourceCode = frame.sourceCode?.map(line => (`${line.line} ${line.content}`));
    if (stringifyedSourceCode) {
      frameString.push(stringifyedSourceCode.join('\n'));
    }

    return frameString.join('\n');
  }).join('\n\n');
}

function buildAddonsString(addons: EventAddons) {
  const ignoredAddons = ["beautifiedUserAgent"];
  const filteredAddons = Object.fromEntries(
    Object.entries(addons).filter(([key]) => !ignoredAddons.includes(key))
  );

  return buildObjectString(filteredAddons);
}

function buildObjectString(obj: object): string | null {
  if (!isObject(obj)) {
    return null;
  }

  const lineArray: string[] = [];
  
  const traverse = (obj: object, level: number = 0) => {
    Object.entries(obj).forEach(([key, value]) => {
      const prefix = " ".repeat(level);
      if (typeof value === "object") {
        lineArray.push(`${prefix}${key}: {`);
        traverse(value, level + 2);
        lineArray.push(`${prefix}}`);
      } else {
        lineArray.push(`${prefix}${key}: ${value}`);
      }
    });
  };

  traverse(obj);

  return lineArray.join('\n');
}
