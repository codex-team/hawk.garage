/**
 * Mock response for fetchEventAiSuggestion
 */
const mockFetchEventAiSuggestion = `# Cause

The crash happens because \`workspace.subscription\` is \`undefined\` for workspaces created before the billing migration, and the code assumes it **always** exists.

## Short summary

\`checkAccess\` reads \`workspace.subscription.status\` without checking whether \`subscription\` exists at all. It fails for *every* workspace that predates the migration, not just some of them.

\`\`\`ts
function checkAccess(workspace: Workspace): boolean {
  return workspace.subscription.status === 'active';
}
\`\`\`

> Any workspace created before the migration hits this on the very first check. It isn't intermittent.

The failure looks like this:

- \`TypeError: Cannot read properties of undefined (reading 'status')\`
- Thrown on the first protected action after signing in
- Never recovers on retry, since the workspace record never changes

## How to fix it

1. Guard the read with an explicit \`subscription\` check, or use [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) before reading \`status\`
2. Backfill the missing field for the affected workspaces
3. Remove the guard once the backfill has run

Either step alone stops the crash. Doing both keeps the code simple once the backfill lands.`;

export default mockFetchEventAiSuggestion;
