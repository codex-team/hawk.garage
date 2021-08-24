/**
 * Common API response format
 */
import { Maybe } from './utils';
import { ASTNode } from 'vue-template-compiler';

/**
 * Proposed format of GraphQL response data
 */
export interface APIResponseData<T = unknown> {
  /**
   * Modified record identifier
   */
  recordId: string;

  /**
   * Modified record
   */
  record: T;
}

/**
 * Every GraphQL response have this structure
 */
export interface APIResponse<T = unknown> {
  /**
   * GraphQL response data
   */
  data: T;

  /**
   * List of GraphQL errors
   */
  errors: APIError[]
}

/**
 * GraphQL error format
 */
export interface APIError {
  message: string,
  nodes?: ReadonlyArray<ASTNode> | ASTNode | undefined,
  source?: Maybe<Source>,
  positions?: Maybe<ReadonlyArray<number>>,
  path?: Maybe<ReadonlyArray<string | number>>,
  originalError?: Maybe<Error>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extensions?: Maybe<{ [key: string]: any }>,
}

/**
 * Apollo GraphQL Error source
 */
declare class Source {
  body: string;
  name: string;
  locationOffset: Location;
  constructor(body: string, name?: string, locationOffset?: Location);
}
