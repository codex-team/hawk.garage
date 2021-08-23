/**
 * Type for Object.entries(someObj)
 *
 * @example type JavaScriptAddonsEntries = Entries<JavaScriptAddons>;
 */
export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

/**
 * List types of object values
 *
 * @example
 * type Foo = { a: string, b: number };
 * type ValueOfFoo = ValueOf<Foo>; // string | number
 */
export type ValueOf<T> = T[keyof T];
