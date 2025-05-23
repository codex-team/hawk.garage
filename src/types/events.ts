import { User } from '@/types/user';
import { EventChartItem } from '@/types/chart';
import { EventAddons } from '@hawk.so/types';

/**
 * Event marks enum
 */
export enum EventMark {
  STARRED = 'STARRED',
  IGNORED = 'IGNORED',
  RESOLVED = 'RESOLVED'
}

/**
 * Available events sort orders
 */
export enum EventsSortOrder {
  /**
   * Sort by timestamp of the last event repetition
   */
  ByDate = 'BY_DATE',

  /**
   * Sort by events count
   */
  ByCount = 'BY_COUNT',

  /**
   * Sort by affected users count
   */
  ByAffectedUsers = 'BY_AFFECTED_USERS'
}

/**
 * Possible events filters by event mark
 */
export interface EventsFilters {
  /**
   * Should events with resolved mark be included
   */
  resolved?: boolean;

  /**
   * Should events with starred mark be included
   */
  starred?: boolean;

  /**
   * Should events with ignored mark be included
   */
  ignored?: boolean;
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

  /**
   * Event assignee
   */
  assignee: User;

  /**
   * Event chart data for a few days
   */
  chartData?: EventChartItem[];

  /**
   * Event release
   */
  release?: HawkEventRelease;
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

  /**
   * Event affected users count, null for old events, when affected users count was not calculated
   */
  readonly affectedUsers: number | null;
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
  get: Record<string, unknown>;

  /**
   * Additional data about POST request
   */
  post: Record<string, unknown>;

  /**
   * HTTP headers
   */
  headers: Record<string, unknown>;

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
  context: Record<string, unknown>;

  /**
   * Custom data provided by project users
   */
  addons: EventAddons;

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
   * Unique repetition payload, null for new delta format
   */
  payload: HawkEventPayload;

  /**
   * Delta payload, null for old delta format or if there is no delta between original and repetition
   */
  delta: string | null;

  /**
   * Flag indicating if the payload has been patched, in case of processing repetition after fetching, we don't need to patch it again
   */
  isPayloadPatched?: boolean;
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
  sourceCode: BacktraceSourceCode[] | null;

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

/**
 * Hawk Event release format
 */
export interface HawkEventRelease {
  /**
   * Release Name
   */
  releaseName: string;

  /**
   * Release Commits
   */
  commits: HawkEventCommit[];
}


/**
 * Hawk Event Commit format
 */
export interface HawkEventCommit {
  /**
   * Commit Hash
   */
  hash: string;

  /**
   * Commit Author
   */
  author: string;

  /**
   * Commit Title
   */
  title: string;

  /**
   * Commit date
   */
  date: Date;
}
