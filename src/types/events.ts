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
  totalCount: string;

  /**
   * Event payload
   */
  payload: HawkEventPayload;

  /**
   * Event repetitions
   */
  repetitions: HawkEventRepetition[];
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
   * Event occurrence date
   */
  readonly date: string;

  /**
   * Last event occurrence timestamp
   */
  readonly timestamp: Date;
}

/**
 * Hawk Event payload format
 */
interface HawkEventPayload {
  /**
   * Event title
   */
  title: string;
}

/**
 * Hawk repetition payload
 */
export interface HawkEventRepetition {
  id: string;
  payload: HawkEventPayload;
}
