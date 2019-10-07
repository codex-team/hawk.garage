export interface HawkEvent {
  id: string;
  catcherType: string;
  groupHash: string;
  totalCount: string;
  payload: HawkEventPayload;
  repetitions: HawkEventRepetition[];
}

export interface EventsWithDailyInfo {
  events: HawkEvent[];
  dailyInfo: HawkEventDailyInfo[];
}

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

interface HawkEventPayload {
  title: string;
}

export interface HawkEventRepetition {
  id: string;
  payload: HawkEventPayload;
}
