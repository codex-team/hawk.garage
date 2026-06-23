import { DEMO_PROJECT_ID, DEMO_SECOND_PROJECT_ID } from '@/api/mock-db';
import type { ChartLine } from '@hawk.so/types';

const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const SECONDS_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE;
const UNIX_MILLISECONDS_BORDER = 1e12;
const MILLISECONDS_IN_SECOND = 1000;
const DEFAULT_GROUP_BY_MINUTES = 60;
const NOISE_INDEX_MULTIPLIER = 12.9898;
const NOISE_SEED_MULTIPLIER = 78.233;
const NOISE_VALUE_MULTIPLIER = 43758.5453;
const LONG_WAVE_CYCLES = 2.6;
const SHORT_WAVE_CYCLES = 7.2;
const HALF = 0.5;
const SHORT_WAVE_WEIGHT = 0.42;
const MIN_TRAFFIC_MULTIPLIER = 0.28;
const RATE_LIMIT_JITTER_BASE = 0.9;
const RATE_LIMIT_NOISE_OFFSET = 97;
const RATE_LIMIT_JITTER_AMPLITUDE = 0.25;
const MAX_CLIPPED_SHARE = 0.72;
const BASE_CLIPPED_SHARE = 0.04;

interface ChartWindow {
  center: number;
  width: number;
  share: number;
}

interface ProjectChartProfile {
  basePerMinute: number;
  amplitude: number;
  trend: number;
  noise: number;
  phase: number;
  seed: number;
  trafficBursts: ChartWindow[];
  rateLimitWindows: ChartWindow[];
}

interface ProjectChartDataResponse {
  data: { project: { chartData: ChartLine[] } };
  errors: unknown[];
}

const PROJECT_CHART_PROFILES: Record<string, ProjectChartProfile> = {
  [DEMO_PROJECT_ID]: {
    basePerMinute: 44,
    amplitude: 0.26,
    trend: 0.18,
    noise: 0.12,
    phase: 0.15,
    seed: 13,
    trafficBursts: [
      {
        center: 0.28,
        width: 0.08,
        share: 0.28,
      },
      {
        center: 0.66,
        width: 0.12,
        share: 0.42,
      },
      {
        center: 0.9,
        width: 0.05,
        share: 0.2,
      },
    ],
    rateLimitWindows: [
      {
        center: 0.64,
        width: 0.08,
        share: 0.2,
      },
      {
        center: 0.72,
        width: 0.06,
        share: 0.16,
      },
    ],
  },
  [DEMO_SECOND_PROJECT_ID]: {
    basePerMinute: 62,
    amplitude: 0.34,
    trend: 0.26,
    noise: 0.18,
    phase: 0.42,
    seed: 29,
    trafficBursts: [
      {
        center: 0.18,
        width: 0.07,
        share: 0.34,
      },
      {
        center: 0.5,
        width: 0.12,
        share: 0.52,
      },
      {
        center: 0.78,
        width: 0.1,
        share: 0.4,
      },
    ],
    rateLimitWindows: [
      {
        center: 0.2,
        width: 0.06,
        share: 0.22,
      },
      {
        center: 0.52,
        width: 0.1,
        share: 0.34,
      },
      {
        center: 0.79,
        width: 0.07,
        share: 0.24,
      },
    ],
  },
};

function toUnixSeconds(value: string | number | undefined, fallback: number): number {
  if (typeof value === 'number') {
    return value > UNIX_MILLISECONDS_BORDER ? Math.floor(value / MILLISECONDS_IN_SECOND) : Math.floor(value);
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const numeric = Number(value);

    if (Number.isFinite(numeric)) {
      return numeric > UNIX_MILLISECONDS_BORDER ? Math.floor(numeric / MILLISECONDS_IN_SECOND) : Math.floor(numeric);
    }

    const parsed = Date.parse(value);

    if (!Number.isNaN(parsed)) {
      return Math.floor(parsed / MILLISECONDS_IN_SECOND);
    }
  }

  return fallback;
}

function getBucketStart(timestamp: number, bucketSizeSeconds: number, timezoneOffset = 0): number {
  const shiftedTimestamp = timestamp - timezoneOffset * SECONDS_IN_MINUTE;

  return Math.floor(shiftedTimestamp / bucketSizeSeconds) * bucketSizeSeconds + timezoneOffset * SECONDS_IN_MINUTE;
}

function getProjectChartProfile(projectId: string): ProjectChartProfile {
  return PROJECT_CHART_PROFILES[projectId] || PROJECT_CHART_PROFILES[DEMO_PROJECT_ID];
}

function deterministicNoise(index: number, seed: number): number {
  const value = Math.sin((index + 1) * NOISE_INDEX_MULTIPLIER + seed * NOISE_SEED_MULTIPLIER) * NOISE_VALUE_MULTIPLIER;

  return value - Math.floor(value);
}

function getWindowPressure(progress: number, windows: ChartWindow[]): number {
  return windows.reduce((pressure, window) => {
    const distance = Math.abs(progress - window.center);

    if (distance > window.width) {
      return pressure;
    }

    const closeness = 1 - distance / window.width;

    return pressure + closeness * closeness * window.share;
  }, 0);
}

function getAcceptedCount(
  index: number,
  progress: number,
  bucketSizeSeconds: number,
  profile: ProjectChartProfile
): number {
  const bucketMinutes = bucketSizeSeconds / SECONDS_IN_MINUTE;
  const base = profile.basePerMinute * bucketMinutes;
  const longWave = Math.sin((progress * LONG_WAVE_CYCLES + profile.phase) * Math.PI * 2);
  const shortWave = Math.sin((progress * SHORT_WAVE_CYCLES + profile.phase / 2) * Math.PI * 2);
  const trafficBurst = getWindowPressure(progress, profile.trafficBursts);
  const trend = (progress - HALF) * profile.trend;
  const noise = (deterministicNoise(index, profile.seed) - HALF) * profile.noise;
  const multiplier = 1 + longWave * profile.amplitude + shortWave * profile.amplitude * SHORT_WAVE_WEIGHT + trend + noise + trafficBurst;

  return Math.max(1, Math.round(base * Math.max(MIN_TRAFFIC_MULTIPLIER, multiplier)));
}

function getRateLimitedCount(
  index: number,
  progress: number,
  acceptedCount: number,
  profile: ProjectChartProfile
): number {
  const limitPressure = getWindowPressure(progress, profile.rateLimitWindows);

  if (limitPressure <= 0) {
    return 0;
  }

  const jitter = RATE_LIMIT_JITTER_BASE + deterministicNoise(index + RATE_LIMIT_NOISE_OFFSET, profile.seed) * RATE_LIMIT_JITTER_AMPLITUDE;
  const clippedShare = Math.min(MAX_CLIPPED_SHARE, BASE_CLIPPED_SHARE + limitPressure);

  return Math.max(1, Math.round(acceptedCount * clippedShare * jitter));
}

/**
 * Mock: fetchChartData (projects)
 *
 * Returns chart data for project overview from mock-db
 * @param projectId - id of the project to load chart data for
 * @param startDate - start date as ISO string or Unix timestamp
 * @param endDate - end date as ISO string or Unix timestamp
 * @param groupBy - grouping interval in minutes
 * @param timezoneOffset - user's local timezone offset in minutes
 * @returns chart data shaped like GraphQL response
 */
export default function mockFetchChartData(
  projectId: string,
  startDate: string,
  endDate: string,
  groupBy: number,
  timezoneOffset = 0
): ProjectChartDataResponse {
  const nowSeconds = Math.floor(Date.now() / MILLISECONDS_IN_SECOND);
  const safeGroupBy = Math.max(1, Number(groupBy) || DEFAULT_GROUP_BY_MINUTES);
  const bucketSizeSeconds = safeGroupBy * SECONDS_IN_MINUTE;
  const startTimestamp = toUnixSeconds(startDate, nowSeconds - SECONDS_IN_DAY);
  const endTimestamp = toUnixSeconds(endDate, nowSeconds);

  if (startTimestamp > endTimestamp) {
    return {
      data: {
        project: {
          chartData: [
            {
              label: 'accepted',
              data: [],
            },
            {
              label: 'rate-limited',
              data: [],
            },
          ],
        },
      },
      errors: [],
    };
  }

  const firstBucket = getBucketStart(startTimestamp, bucketSizeSeconds, timezoneOffset);
  const lastBucket = getBucketStart(endTimestamp, bucketSizeSeconds, timezoneOffset);
  const bucketTimestamps: number[] = [];

  for (let bucket = firstBucket; bucket <= lastBucket; bucket += bucketSizeSeconds) {
    bucketTimestamps.push(bucket);
  }

  const profile = getProjectChartProfile(projectId);
  const lastIndex = Math.max(1, bucketTimestamps.length - 1);
  const acceptedLine = bucketTimestamps.map((timestamp, index) => {
    const progress = index / lastIndex;

    return {
      timestamp,
      count: getAcceptedCount(index, progress, bucketSizeSeconds, profile),
    };
  });
  const rateLimitedLine = acceptedLine.map((point, index) => {
    const progress = index / lastIndex;

    return {
      timestamp: point.timestamp,
      count: getRateLimitedCount(index, progress, point.count, profile),
    };
  });

  return {
    data: {
      project: {
        chartData: [
          {
            label: 'accepted',
            data: acceptedLine,
          },
          {
            label: 'rate-limited',
            data: rateLimitedLine,
          },
        ],
      },
    },
    errors: [],
  };
}
