import type { DailyEvent, HawkEvent } from "./events";

/**
 * File attached to the release
 */
export interface ReleaseFile {
  /**
   * Map file name we got
   */
  mapFileName: string;

  /**
   * Origin file name from which we the map was built
   */
  originFileName: string;

  /**
   * File size in bytes
   */
  length: number | null;
}

/**
 * Hawk Event Commit format
 */
export interface ReleaseCommit {
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

/**
 * Daily events portion for the release
 */
export interface ReleaseDailyEventsPortion {
  /**
   * List of daily events
   */
  dailyEvents: DailyEvent[];
}

/**
 * Release details
 */
export interface ReleaseDetails {
  /**
   * Release identifier
   */
  release: string;

  /**
   * Number of commits in this release
   */
  commitsCount: number;

  /**
   * Number of files in this release
   */
  filesCount: number;

  /**
   * Release creation timestamp
   */
  timestamp: number;

  /**
   * List of files attached to the release
   */
  files: ReleaseFile[];

  /**
   * List of commits in this release
   */
  commits: ReleaseCommit[];

  /**
   * Daily events portion for the release
   */
  dailyEventsPortion: ReleaseDailyEventsPortion;
}

