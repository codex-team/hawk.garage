import type { Breadcrumb } from '@hawk.so/types';
import type { HawkEvent } from '@/types/events';

const SECOND_IN_MILLISECONDS = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MOCK_HISTORY_DAYS = 14;
const MOCK_TOTAL_REPETITIONS = 1847;
const FIRST_SEEN_STAGGER = 0.08;
const HOUR_IN_SECONDS = SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
const DAY_IN_SECONDS = HOURS_IN_DAY * HOUR_IN_SECONDS;

const pathTemplates: Breadcrumb[][] = [
  [
    {
      timestamp: 0,
      type: 'navigation',
      category: 'route.change',
      message: '/checkout',
    },
    {
      timestamp: 0,
      type: 'request',
      category: 'fetch',
      message: 'GET /api/cart',
      data: {
        method: 'GET',
        statusCode: 200,
      },
    },
    {
      timestamp: 0,
      type: 'ui',
      category: 'ui.click',
      message: 'button[data-action="submit-order"]',
    },
    {
      timestamp: 0,
      type: 'request',
      category: 'fetch',
      message: 'POST /api/orders',
      data: {
        method: 'POST',
        statusCode: 500,
      },
    },
  ],
  [
    {
      timestamp: 0,
      type: 'navigation',
      category: 'route.change',
      message: '/cart',
    },
    {
      timestamp: 0,
      type: 'ui',
      category: 'ui.click',
      message: 'a[href="/checkout"]',
    },
    {
      timestamp: 0,
      type: 'navigation',
      category: 'history.push',
      message: '/checkout',
    },
    {
      timestamp: 0,
      type: 'request',
      category: 'fetch',
      message: 'GET /api/profile',
      data: {
        method: 'GET',
        statusCode: 200,
      },
    },
    {
      timestamp: 0,
      type: 'request',
      category: 'fetch',
      message: 'POST /api/orders',
      data: {
        method: 'POST',
        statusCode: 500,
      },
    },
  ],
  [
    {
      timestamp: 0,
      type: 'navigation',
      category: 'route.change',
      message: '/products/:productId',
    },
    {
      timestamp: 0,
      type: 'logic',
      category: 'service.method',
      message: 'cart.addItem',
    },
    {
      timestamp: 0,
      type: 'ui',
      category: 'ui.click',
      message: 'button.checkout',
    },
    {
      timestamp: 0,
      type: 'request',
      category: 'fetch',
      message: 'POST /api/orders',
      data: {
        method: 'POST',
        statusCode: 500,
      },
    },
  ],
  [
    {
      timestamp: 0,
      type: 'navigation',
      category: 'route.change',
      message: '/checkout',
    },
    {
      timestamp: 0,
      type: 'request',
      category: 'fetch',
      message: 'POST /api/promocodes/validate',
      data: {
        method: 'POST',
        statusCode: 200,
      },
    },
    {
      timestamp: 0,
      type: 'ui',
      category: 'ui.click',
      message: 'button[data-action="submit-order"]',
    },
    {
      timestamp: 0,
      type: 'request',
      category: 'fetch',
      message: 'POST /api/orders',
      data: {
        method: 'POST',
        statusCode: 500,
      },
    },
  ],
  [
    {
      timestamp: 0,
      type: 'navigation',
      category: 'route.change',
      message: '/checkout',
    },
    {
      timestamp: 0,
      type: 'ui',
      category: 'ui.click',
      message: 'button[data-action="submit-order"]',
    },
    {
      timestamp: 0,
      type: 'request',
      category: 'fetch',
      message: 'POST /api/payment-intents',
      data: {
        method: 'POST',
        statusCode: 200,
      },
    },
    {
      timestamp: 0,
      type: 'logic',
      category: 'service.method',
      message: 'order.confirm',
    },
  ],
  [
    {
      timestamp: 0,
      type: 'navigation',
      category: 'route.change',
      message: '/catalog',
    },
    {
      timestamp: 0,
      type: 'ui',
      category: 'ui.click',
      message: 'article.product-card',
    },
    {
      timestamp: 0,
      type: 'navigation',
      category: 'history.push',
      message: '/products/:productId',
    },
    {
      timestamp: 0,
      type: 'request',
      category: 'fetch',
      message: 'GET /api/products/:productId',
      data: {
        method: 'GET',
        statusCode: 200,
      },
    },
    {
      timestamp: 0,
      type: 'logic',
      category: 'service.method',
      message: 'checkout.restore',
    },
  ],
  [
    {
      timestamp: 0,
      type: 'navigation',
      category: 'route.change',
      message: '/checkout',
    },
    {
      timestamp: 0,
      type: 'ui',
      category: 'ui.click',
      message: 'input[name="delivery"]',
    },
    {
      timestamp: 0,
      type: 'request',
      category: 'fetch',
      message: 'GET /api/delivery/slots',
      data: {
        method: 'GET',
        statusCode: 200,
      },
    },
    {
      timestamp: 0,
      type: 'ui',
      category: 'ui.click',
      message: 'button[data-action="submit-order"]',
    },
  ],
  [
    {
      timestamp: 0,
      type: 'navigation',
      category: 'route.change',
      message: '/account/orders',
    },
    {
      timestamp: 0,
      type: 'ui',
      category: 'ui.click',
      message: 'button.repeat-order',
    },
    {
      timestamp: 0,
      type: 'request',
      category: 'fetch',
      message: 'POST /api/orders/:orderId/repeat',
      data: {
        method: 'POST',
        statusCode: 200,
      },
    },
    {
      timestamp: 0,
      type: 'navigation',
      category: 'history.push',
      message: '/checkout',
    },
  ],
  [
    {
      timestamp: 0,
      type: 'navigation',
      category: 'route.change',
      message: '/checkout',
    },
    {
      timestamp: 0,
      type: 'request',
      category: 'fetch',
      message: 'GET /api/cart',
      data: {
        method: 'GET',
        statusCode: 200,
      },
    },
    {
      timestamp: 0,
      type: 'logic',
      category: 'service.method',
      message: 'cart.recalculate',
    },
    {
      timestamp: 0,
      type: 'request',
      category: 'fetch',
      message: 'PATCH /api/cart',
      data: {
        method: 'PATCH',
        statusCode: 409,
      },
    },
  ],
  [
    {
      timestamp: 0,
      type: 'navigation',
      category: 'route.change',
      message: '/checkout',
    },
    {
      timestamp: 0,
      type: 'ui',
      category: 'ui.click',
      message: 'button.login',
    },
    {
      timestamp: 0,
      type: 'request',
      category: 'fetch',
      message: 'POST /api/auth/refresh',
      data: {
        method: 'POST',
        statusCode: 401,
      },
    },
    {
      timestamp: 0,
      type: 'logic',
      category: 'middleware.auth',
      message: 'session.restore',
    },
  ],
  [
    {
      timestamp: 0,
      type: 'navigation',
      category: 'route.change',
      message: '/checkout',
    },
    {
      timestamp: 0,
      type: 'ui',
      category: 'ui.click',
      message: 'select[name="payment-method"]',
    },
    {
      timestamp: 0,
      type: 'request',
      category: 'fetch',
      message: 'GET /api/payment-methods',
      data: {
        method: 'GET',
        statusCode: 200,
      },
    },
    {
      timestamp: 0,
      type: 'ui',
      category: 'ui.click',
      message: 'button[data-action="submit-order"]',
    },
    {
      timestamp: 0,
      type: 'request',
      category: 'fetch',
      message: 'POST /api/orders',
      data: {
        method: 'POST',
        statusCode: 502,
      },
    },
  ],
  [
    {
      timestamp: 0,
      type: 'navigation',
      category: 'route.change',
      message: '/favorites',
    },
    {
      timestamp: 0,
      type: 'ui',
      category: 'ui.click',
      message: 'button.add-all-to-cart',
    },
    {
      timestamp: 0,
      type: 'logic',
      category: 'service.method',
      message: 'cart.addItems',
    },
    {
      timestamp: 0,
      type: 'navigation',
      category: 'history.push',
      message: '/checkout',
    },
  ],
];

/**
 * Explicit UX fixture values keep the mock predictable while the backend
 * contract is not implemented.
 */
/* eslint-disable @typescript-eslint/no-magic-numbers */
const pathWeights = [0.24, 0.17, 0.13, 0.1, 0.08, 0.065, 0.05, 0.04, 0.03, 0.022, 0.016, 0.01];
const usersWeights = [0.28, 0.86, 0.63, 0.92, 0.58, 0.75, 0.41, 0.95, 0.52, 0.84, 0.67, 1];
const lastSeenOffsets = [
  4 * HOUR_IN_SECONDS,
  0,
  2 * DAY_IN_SECONDS,
  HOUR_IN_SECONDS,
  6 * DAY_IN_SECONDS,
  8 * HOUR_IN_SECONDS,
  4 * DAY_IN_SECONDS,
  3 * HOUR_IN_SECONDS,
  10 * DAY_IN_SECONDS,
  DAY_IN_SECONDS,
  12 * HOUR_IN_SECONDS,
  7 * DAY_IN_SECONDS,
];
/* eslint-enable @typescript-eslint/no-magic-numbers */

/**
 * Build a mock response shaped like a future GraphQL occurrence paths query.
 * Path steps deliberately keep the existing Breadcrumb model.
 * @param projectId - current project id
 * @param event - selected event group
 */
// The response stays inferred to avoid introducing a frontend domain type for a mock-only backend contract.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getEventOccurrencePathsMock(projectId: string, event: HawkEvent) {
  const totalRepetitions = MOCK_TOTAL_REPETITIONS;
  const pathsCount = pathTemplates.length;
  const lastEventTimestamp = Math.round(event.timestamp || Date.now() / SECOND_IN_MILLISECONDS);
  const firstEventTimestamp = lastEventTimestamp - MOCK_HISTORY_DAYS * DAY_IN_SECONDS;
  const eventLifetime = Math.max(DAY_IN_SECONDS, lastEventTimestamp - firstEventTimestamp);
  let repetitionsLeft = totalRepetitions;

  const nodes = pathTemplates.slice(0, pathsCount).map((template, index) => {
    const pathsLeft = pathsCount - index;
    const maxAvailable = repetitionsLeft - (pathsLeft - 1);
    const weightedCount = Math.max(1, Math.floor(totalRepetitions * pathWeights[index]));
    const repetitionsCount = Math.min(weightedCount, maxAvailable);
    const lastSeen = Math.max(firstEventTimestamp, lastEventTimestamp - lastSeenOffsets[index]);
    const firstSeen = Math.min(
      lastSeen,
      firstEventTimestamp + Math.round(eventLifetime * index * FIRST_SEEN_STAGGER)
    );
    const stepInterval = 1300;
    const pathEndTimestamp = lastSeen * SECOND_IN_MILLISECONDS;
    const errorStep: Breadcrumb = {
      timestamp: pathEndTimestamp,
      type: 'error',
      category: event.payload.type ?? 'Application error',
      message: event.payload.title,
      level: 'error',
    };
    const breadcrumbs = [...template, errorStep].map((breadcrumb, stepIndex, path) => ({
      ...breadcrumb,
      timestamp: pathEndTimestamp - (path.length - stepIndex - 1) * stepInterval,
    }));

    repetitionsLeft -= repetitionsCount;

    return {
      breadcrumbs,
      repetitionsCount,
      usersAffected: Math.max(1, Math.min(
        repetitionsCount,
        Math.round(repetitionsCount * usersWeights[index])
      )),
      share: repetitionsCount / totalRepetitions,
      firstSeen,
      lastSeen,
    };
  });

  return {
    data: {
      project: {
        id: projectId,
        event: {
          id: event.originalEventId,
          occurrencePaths: {
            totalCount: nodes.length,
            nodes,
          },
        },
      },
    },
  };
}
