export interface HawkEvent {
  id: string;
  catcherType: string;
  groupHash: string;
  totalCount: string;
  payload: HawkEventPayload;
  repetitions: HawkEventRepetition[];
}

export interface RecentEvents {
  events: HawkEvent[];
  dailyInfo: HawkEventDailyInfo[];
}

interface HawkEventDailyInfo {
  groupHash: string;
  count: number;
  date: string;
  timestamp: Date;
}

interface HawkEventPayload {
  title: string;
}

interface HawkEventRepetition {
  id: string;
}
