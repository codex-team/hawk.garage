/**
 * Type for Object.entries(someObj)
 *
 * @example type JavaScriptAddonsEntries = Entries<JavaScriptAddons>;
 */
export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];
