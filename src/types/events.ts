import { User } from '@/types/user';

/**
 * Event marks enum
 */
export enum EventMark {
  STARRED = 'STARRED',
  IGNORED = 'IGNORED',
  RESOLVED = 'RESOLVED'
}

/**
 * Interface representing Hawk Event format
 */
export interface HawkEvent {
  /**
   * Event id
   */
  id: string;

  /**
   * Event catcher type
   */
  catcherType: string;

  /**
   * Event group hash
   */
  groupHash: string;

  /**
   * Event occurrence count
   */
  totalCount: number;

  /**
   * Users who visited this event
   */
  visitedBy: User[];

  /**
   * Event marks for current user
   */
  marks: {
    resolved: boolean;
    starred: boolean;
    ignored: boolean;
  };

  /**
   * Event payload
   */
  payload: HawkEventPayload;

  /**
   * Event repetition
   */
  repetition: HawkEventRepetition;

  /**
   * Event repetitions
   */
  repetitions: HawkEventRepetition[];

  /**
   * How many users catch this error
   */
  usersAffected: number;
}

/**
 * Events along with information about each for specific days
 */
export interface EventsWithDailyInfo {
  events: HawkEvent[];
  dailyInfo: HawkEventDailyInfo[];
}

/**
 * Information about Event for specific day
 */
export interface HawkEventDailyInfo {
  /**
   * Event hash for grouping
   */
  readonly groupHash: string;

  /**
   * Event occurrence count
   */
  readonly count: number;

  /**
   * Event occurrence date midnight (used for grouping)
   */
  readonly groupingTimestamp: number;

  /**
   * Event's last repetition id
   */
  readonly lastRepetitionId: string;

  /**
   * Last event occurrence timestamp
   */
  readonly lastRepetitionTime: number;
}

/**
 * Hawk Event payload format
 */
export interface HawkEventPayload {
  /**
   * Event title
   */
  title: string;

  /**
   * Event timestamp
   */
  timestamp: number;

  /**
   * Event stack array from the latest call to the earliest
   */
  backtrace: HawkEventBacktraceFrame[];

  /**
   * Additional data about GET request
   */
  get: object;

  /**
   * Additional data about POST request
   */
  post: object;

  /**
   * HTTP headers
   */
  headers: object;

  /**
   * Source code version identifier
   */
  release: string;

  /**
   * Current authenticated user
   */
  user: EventUser;

  /**
   * Any additional data of Event
   */
  context: object;

  /**
   * Custom data provided by project users
   */
  addons: object;

  /**
   * Event type: TypeError, ReferenceError etc.
   */
  type?: string;
}

/**
 * Hawk repetition payload
 */
export interface HawkEventRepetition {
  /**
   * Repetitions ID
   */
  id: string;

  /**
   * Unique repetition payload
   */
  payload: HawkEventPayload;
}

export interface HawkEventBacktraceFrame {
  /**
   * Source filepath
   */
  file: string;

  /**
   * Called line
   */
  line: number;

  /**
   * Called column
   */
  column: number;

  /**
   * Part of source code file near the called line
   */
  sourceCode: BacktraceSourceCode[];

  /**
   * Function name extracted from current stack frame
   */
  function: string;

  /**
   * Function arguments extracted from current stack frame
   */
  arguments: string[];
}

export interface BacktraceSourceCode {
  /**
   * line's number
   */
  line: number;

  /**
   * line's content
   */
  content: string;
}

export interface EventUser {
  /**
   * User id
   */
  id: number;

  /**
   * User name
   */
  name: string;

  /**
   * User url
   */
  url: string;

  /**
   * User photo
   */
  photo: string;
}
