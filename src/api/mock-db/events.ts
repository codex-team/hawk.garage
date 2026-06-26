/* eslint-disable @typescript-eslint/no-magic-numbers */
/**
 * Mock database: Events
 *
 * Contains demo error events with realistic data
 */

import type { Breadcrumb, HawkEvent, User } from '@hawk.so/types';
import { MILLISECONDS_IN_SECOND, SECONDS_IN_DAY, SECONDS_IN_HOUR, SECONDS_IN_MINUTE } from '@/utils/time';
import { DEMO_PROJECT_ID, DEMO_SECOND_PROJECT_ID } from './workspaces';
import { DEMO_AFFECTED_USER, DEMO_USER } from './users';

const NOW_SECONDS = Math.floor(Date.now() / MILLISECONDS_IN_SECOND);
const FIRST_PROJECT_EVENT_MULTIPLIER = 112;
const SECOND_PROJECT_EVENT_MULTIPLIER = 138;
const FIRST_PROJECT_EVENT_BASE = 760;
const SECOND_PROJECT_EVENT_BASE = 1240;
const RATE_LIMIT_EVENT_BOOST = 900;
const NETWORK_EVENT_BOOST = 520;
const USERS_AFFECTED_MULTIPLIER = 19;
const SECOND_PROJECT_USERS_BOOST = 120;
const MAX_USERS_AFFECTED_SHARE = 0.42;
const CONSOLE_MESSAGE_DISPLAY_WIDTH = 96;
const USER_STATE_CUSTOM_BREADCRUMB_TYPE = 'demo.workspace.very.long.custom.breadcrumb.type.user-state-hydration-before-account-menu-crash';
const DEMO_EVENT_PROJECT_ID_BY_ID = new Map<string, string>();

interface DemoBreadcrumbContext {
  projectId: string;
  eventType: string;
  title: string;
  timestamp: number;
}

interface DemoAddonsContext {
  projectId: string;
  eventType: string;
  title: string;
  timestamp: number;
}

type DemoBacktraceFrame = HawkEvent['payload']['backtrace'][number];

function getScaledTotalCount(totalCount: number, type: string, projectId: string): number {
  const isSecondProject = projectId === DEMO_SECOND_PROJECT_ID;
  const multiplier = isSecondProject ? SECOND_PROJECT_EVENT_MULTIPLIER : FIRST_PROJECT_EVENT_MULTIPLIER;
  const base = isSecondProject ? SECOND_PROJECT_EVENT_BASE : FIRST_PROJECT_EVENT_BASE;
  const rateLimitBoost = type === 'RateLimitError' ? RATE_LIMIT_EVENT_BOOST : 0;
  const networkBoost = type === 'NetworkError' ? NETWORK_EVENT_BOOST : 0;

  return totalCount * multiplier + base + rateLimitBoost + networkBoost;
}

function getScaledUsersAffected(usersAffected: number, totalCount: number, projectId: string): number {
  const projectBoost = projectId === DEMO_SECOND_PROJECT_ID ? SECOND_PROJECT_USERS_BOOST : 0;
  const scaledUsers = usersAffected * USERS_AFFECTED_MULTIPLIER + projectBoost;
  const maxUsersAffected = Math.floor(totalCount * MAX_USERS_AFFECTED_SHARE);

  return Math.max(1, Math.min(maxUsersAffected, scaledUsers));
}

function getDemoServerId(context: DemoAddonsContext): string {
  const isSecondProject = context.projectId === DEMO_SECOND_PROJECT_ID;
  const title = context.title.toLowerCase();

  if (context.eventType === 'RateLimitError') {
    return isSecondProject ? 'mobile-ingest-prod-02' : 'ingest-api-prod-03';
  }

  if (context.eventType === 'NetworkError') {
    return isSecondProject ? 'mobile-sync-prod-01' : 'profile-api-prod-02';
  }

  if (context.eventType === 'SyntaxError') {
    return isSecondProject ? 'mobile-storage-prod-01' : 'events-api-prod-02';
  }

  if (context.eventType === 'ReferenceError') {
    return isSecondProject ? 'mobile-bootstrap-prod-01' : 'web-bootstrap-prod-01';
  }

  if (context.eventType === 'RangeError') {
    return title.includes('date') ? 'release-api-prod-01' : 'serializer-prod-01';
  }

  if (context.eventType === 'TypeError' && title.includes('user')) {
    return 'web-api-prod-01';
  }

  return isSecondProject ? 'mobile-api-prod-02' : 'web-render-prod-01';
}

function createDemoContext(context: DemoAddonsContext): Record<string, unknown> {
  return {
    isPaidUser: true,
    serverId: getDemoServerId(context),
    env: 'production',
  };
}

function getConsoleTimestamp(eventTimestamp: number, millisecondsOffset: number): string {
  return new Date(eventTimestamp * MILLISECONDS_IN_SECOND + millisecondsOffset).toISOString();
}

function padConsoleMessage(message: string): string {
  return message.padEnd(CONSOLE_MESSAGE_DISPLAY_WIDTH, ' ');
}

function isUserStateTypeError(context: DemoAddonsContext | DemoBreadcrumbContext): boolean {
  return context.eventType === 'TypeError' && context.title.includes('user');
}

function createUserStateConsoleOutput(context: DemoAddonsContext): Array<Record<string, unknown>> {
  return [
    {
      method: 'log',
      type: 'log',
      message: padConsoleMessage('Demo workspace shell mounted'),
      timestamp: getConsoleTimestamp(context.timestamp, -5600),
      stack: 'console.log\n    at mountApp (src/main.ts:38)\n    at bootstrapDemoWorkspace (src/main.ts:55)\n    at src/main.ts:72',
    },
    {
      method: 'info',
      type: 'info',
      message: padConsoleMessage('Restored auth snapshot from localStorage: session key missing'),
      timestamp: getConsoleTimestamp(context.timestamp, -5320),
      stack: 'console.info\n    at restoreAuthSnapshot (src/store/auth/persistedState.ts:28)\n    at hydrateStore (src/store/index.ts:44)\n    at bootstrapDemoWorkspace (src/main.ts:53)',
    },
    {
      method: 'warn',
      type: 'warn',
      message: padConsoleMessage('User store hydration received undefined auth.session'),
      timestamp: getConsoleTimestamp(context.timestamp, -5200),
      stack: 'console.warn\n    at hydrateUserModule (src/store/user.ts:31)\n    at restoreAuthSnapshot (src/store/auth/persistedState.ts:33)\n    at hydrateStore (src/store/index.ts:44)',
    },
    {
      method: 'error',
      type: 'error',
      message: padConsoleMessage('TypeError: Cannot read property \'user\' of undefined'),
      timestamp: getConsoleTimestamp(context.timestamp, -5100),
      stack: 'TypeError: Cannot read property \'user\' of undefined\n    at selectCurrentUser (src/store/user.ts:42)\n    at currentUser (src/store/getters.ts:18)\n    at computed.currentUser (src/components/layout/UserMenu.vue:67)\n    at renderComponentRoot (node_modules/vue/runtime-core.esm-bundler.js:6560)',
    },
    {
      method: 'debug',
      type: 'debug',
      message: padConsoleMessage('UserMenu requested current user from store getter'),
      timestamp: getConsoleTimestamp(context.timestamp, -5000),
      stack: 'console.debug\n    at computed.currentUser (src/components/layout/UserMenu.vue:67)\n    at setup (src/components/layout/UserMenu.vue:74)\n    at renderComponentRoot (node_modules/vue/runtime-core.esm-bundler.js:6560)',
    },
  ];
}

function createDefaultConsoleOutput(context: DemoAddonsContext): Array<Record<string, unknown>> {
  const isSecondProject = context.projectId === DEMO_SECOND_PROJECT_ID;
  const isRateLimited = context.eventType === 'RateLimitError';
  const isNetworkError = context.eventType === 'NetworkError';

  return [
    {
      method: 'log',
      type: 'log',
      message: padConsoleMessage(isSecondProject ? 'Mobile shell mounted with demo workspace payload' : 'Demo workspace shell mounted'),
      timestamp: getConsoleTimestamp(context.timestamp, -5600),
      stack: isSecondProject
        ? 'console.log\n    at mountMobileShell (src/mobile/App.vue:18)\n    at bootstrapDemoWorkspace (src/main.ts:31)'
        : 'console.log\n    at mountApp (src/App.vue:24)\n    at bootstrapDemoWorkspace (src/main.ts:31)',
    },
    {
      method: 'info',
      type: 'info',
      message: padConsoleMessage(isSecondProject ? 'Resolved route: /mobile-beta/releases/2.8.0' : 'Resolved route: /dashboard/projects/production'),
      timestamp: getConsoleTimestamp(context.timestamp, -5450),
      stack: isSecondProject
        ? 'console.info\n    at resolveRoute (src/mobile/router.ts:57)\n    at beforeEach (src/router/index.ts:42)'
        : 'console.info\n    at resolveRoute (src/router/index.ts:57)\n    at beforeEach (src/router/index.ts:42)',
    },
    {
      method: 'warn',
      type: 'warn',
      message: padConsoleMessage('Unhead is missing Vue context, falling back to shared context. This may have unexpected results.'),
      timestamp: getConsoleTimestamp(context.timestamp, -5200),
      stack: 'console.warn\n    at useHead (node_modules/@unhead/vue/dist/index.mjs:128)\n    at setupMeta (src/composables/usePageMeta.ts:14)',
    },
    {
      method: 'error',
      type: 'error',
      message: padConsoleMessage(isRateLimited ? 'Rate limit reached for project token: batch was clipped' : `Global error caught: ${context.title}`),
      timestamp: getConsoleTimestamp(context.timestamp, -5100),
      stack: isRateLimited
        ? 'RateLimitError: project quota exceeded\n    at sendBatch (src/api/events/index.ts:87)\n    at flushQueue (src/hawk.ts:41)'
        : 'Error: Global error caught\n    at app.config.errorHandler (src/main.ts:22)\n    at callWithErrorHandling (node_modules/vue/runtime-core.esm-bundler.js:199)',
    },
    {
      method: 'debug',
      type: 'debug',
      message: padConsoleMessage(isRateLimited ? 'Rate limit backoff scheduled after clipped batch' : isNetworkError ? 'Retry policy exhausted for failing request' : isSecondProject ? '[vite] hot updated: /src/mobile/App.vue' : '[vite] hot updated: /src/App.vue'),
      timestamp: getConsoleTimestamp(context.timestamp, -4800),
      stack: isRateLimited
        ? 'console.debug\n    at scheduleBackoff (src/api/events/index.ts:122)\n    at sendBatch (src/api/events/index.ts:87)'
        : isNetworkError
          ? 'console.debug\n    at retryRequest (src/api/http.ts:88)\n    at loadProfile (src/store/user.ts:42)'
          : isSecondProject
            ? 'console.debug\n    at handleHotUpdate (node_modules/vite/client:212)\n    at src/mobile/App.vue'
            : 'console.debug\n    at handleHotUpdate (node_modules/vite/client:212)\n    at src/App.vue',
    },
  ];
}

function createDemoAddons(context: DemoAddonsContext): Record<string, unknown> {
  const isSecondProject = context.projectId === DEMO_SECOND_PROJECT_ID;
  const isUserStateError = isUserStateTypeError(context);
  const currentUrl = isSecondProject
    ? 'http://localhost:8080/mobile-beta?test=1&rollout=35'
    : 'http://localhost:8080/?test=1';

  return {
    window: {
      innerWidth: isSecondProject ? 390 : 1896,
      innerHeight: isSecondProject ? 844 : 437,
    },
    userAgent: isSecondProject
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1'
      : 'Mozilla/5.0 (X11; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0',
    url: currentUrl,
    get: isSecondProject
      ? {
          test: '1',
          rollout: '35',
        }
      : {
          test: '1',
        },
    consoleOutput: isUserStateError ? createUserStateConsoleOutput(context) : createDefaultConsoleOutput(context),
    beautifiedUserAgent: isSecondProject
      ? {
          os: 'iOS',
          osVersion: '18.2',
          browser: 'Safari',
          browserVersion: '18.2.0',
        }
      : {
          os: 'Linux',
          osVersion: '',
          browser: 'Firefox',
          browserVersion: '149.0.0',
        },
  };
}

function getFetchErrorBreadcrumb(
  isRateLimited: boolean,
  isNetworkError: boolean,
  apiPrefix: string,
  isSecondProject: boolean,
  timestamp: number
): Breadcrumb {
  if (isRateLimited) {
    return {
      timestamp: timestamp - 250,
      type: 'request',
      category: 'fetch',
      message: `POST ${apiPrefix}/events 429`,
      level: 'warning',
      data: {
        method: 'POST',
        url: `${apiPrefix}/events`,
        statusCode: 429,
        duration: isSecondProject ? 74 : 61,
        retryAfter: isSecondProject ? 3600 : 86400,
      },
    };
  }

  if (isNetworkError) {
    return {
      timestamp: timestamp - 250,
      type: 'request',
      category: 'fetch',
      message: `[FAIL] GET ${apiPrefix}/profile`,
      level: 'error',
      data: {
        method: 'GET',
        url: `${apiPrefix}/profile`,
        statusCode: 0,
        duration: 30000,
        reason: 'network-timeout',
      },
    };
  }

  return {
    timestamp: timestamp - 250,
    type: 'request',
    category: 'fetch',
    message: `POST ${apiPrefix}/events 500`,
    level: 'error',
    data: {
      method: 'POST',
      url: `${apiPrefix}/events`,
      statusCode: 500,
      duration: isSecondProject ? 336 : 214,
      reason: 'collector-demo-failure',
    },
  };
}

function createDemoBreadcrumbs(context: DemoBreadcrumbContext): Breadcrumb[] {
  const timestamp = context.timestamp * MILLISECONDS_IN_SECOND;
  const isSecondProject = context.projectId === DEMO_SECOND_PROJECT_ID;
  const appRoute = isSecondProject ? '/mobile-beta/releases/2.8.0' : '/dashboard/projects/production';
  const apiPrefix = isSecondProject ? '/api/mobile' : '/api';
  const featureFlag = isSecondProject ? 'beta-onboarding-redesign' : 'demo-workspace-overview';
  const isRateLimited = context.eventType === 'RateLimitError';
  const isNetworkError = context.eventType === 'NetworkError';
  const isUserStateError = isUserStateTypeError(context);
  const userStateTailBreadcrumbs: Breadcrumb[] = isUserStateError
    ? [
        {
          timestamp: timestamp - 160,
          type: USER_STATE_CUSTOM_BREADCRUMB_TYPE,
          category: 'state.diagnostics',
          message: 'Custom breadcrumb type emitted before account menu crash',
          level: 'debug',
          data: {
            reason: 'long-custom-type-visual-test',
            component: 'UserMenu.vue',
            errorPreview: context.title,
          },
        },
        {
          timestamp: timestamp - 100,
          type: 'error',
          category: 'error.captured',
          message: context.title,
          level: 'error',
          data: {
            errorType: context.eventType,
            value: context.title,
            mechanism: 'vue.errorHandler',
            handled: true,
          },
        },
      ]
    : [];

  return [
    {
      timestamp: timestamp - 9200,
      type: 'default',
      category: 'sdk.init',
      message: 'Hawk catcher initialized with demo context',
      level: 'info',
      data: {
        catcher: '@hawk.so/javascript',
        breadcrumbsEnabled: true,
        maxBreadcrumbs: 20,
      },
    },
    {
      timestamp: timestamp - 7600,
      type: 'logic',
      category: 'feature.flag',
      message: `Feature flag evaluated: ${featureFlag}`,
      level: 'debug',
      data: {
        flag: featureFlag,
        value: true,
        rollout: isSecondProject ? 35 : 100,
      },
    },
    {
      timestamp: timestamp - 5600,
      type: 'request',
      category: 'fetch',
      message: `GET ${apiPrefix}/me 200`,
      level: 'info',
      data: {
        method: 'GET',
        url: `${apiPrefix}/me`,
        statusCode: 200,
        duration: isSecondProject ? 184 : 92,
      },
    },
    {
      timestamp: timestamp - 3400,
      type: isUserStateError ? 'logic' : 'error',
      category: isUserStateError ? 'state.hydration' : context.eventType === 'SyntaxError' ? 'json.parse' : 'vue.errorHandler',
      message: isUserStateError
        ? 'Auth state restored without session.user'
        : context.eventType === 'SyntaxError' ? 'JSON parser failed while processing response body' : `Captured ${context.title}`,
      level: isUserStateError ? 'warning' : 'error',
      data: isUserStateError
        ? {
            module: 'user',
            expected: 'state.auth.session.user',
            actual: 'state.auth.session',
            value: undefined,
          }
        : {
            release: isSecondProject ? 'mobile-2.8.0-beta.4' : 'web-1.24.3',
            environment: isSecondProject ? 'beta' : 'production',
            handled: true,
          },
    },
    getFetchErrorBreadcrumb(isRateLimited, isNetworkError, apiPrefix, isSecondProject, timestamp),
    {
      timestamp: timestamp - 700,
      type: 'ui',
      category: 'ui.click',
      message: isUserStateError ? 'Click on account menu button' : isSecondProject ? 'Tap on Retry sync button' : 'Click on Refresh events button',
      level: 'info',
      data: {
        selector: isUserStateError ? 'button[data-test="account-menu"]' : isSecondProject ? 'button[data-test="retry-sync"]' : 'button[data-test="refresh-events"]',
        component: isUserStateError ? 'UserMenu.vue' : isSecondProject ? 'OfflineQueueBanner.vue' : 'ProjectHeader.vue',
        pointerType: 'mouse',
      },
    },
    {
      timestamp: timestamp - 1200,
      type: 'navigation',
      category: 'history.push',
      message: `Navigated to ${appRoute}`,
      level: 'info',
      data: {
        from: isSecondProject ? '/mobile-beta/login' : '/dashboard',
        to: appRoute,
        navigationType: 'pushState',
      },
    },
    ...userStateTailBreadcrumbs,
  ];
}

function createUserStateTypeErrorBacktrace(file: string, line: number): HawkEvent['payload']['backtrace'] {
  return [
    {
      file,
      line,
      column: 18,
      function: 'selectCurrentUser',
      arguments: ['state'],
      sourceCode: [
        {
          line: line - 7,
          content: 'import type { RootState } from "@/store/types";',
        },
        {
          line: line - 6,
          content: 'import { normalizeAffectedUser } from "@/utils/users";',
        },
        {
          line: line - 5,
          content: '',
        },
        {
          line: line - 4,
          content: 'export function selectCurrentUser(state: RootState) {',
        },
        {
          line: line - 3,
          content: '  const session = state.auth.session;',
        },
        {
          line: line - 2,
          content: '  const profileId = state.auth.profileId;',
        },
        {
          line: line - 1,
          content: '  const profile = profileId ? state.profiles.byId[profileId] : null;',
        },
        {
          line,
          content: '  return session.user ? normalizeAffectedUser(session.user) : profile;',
        },
        {
          line: line + 1,
          content: '}',
        },
        {
          line: line + 2,
          content: '',
        },
        {
          line: line + 3,
          content: 'export const userGetters = {',
        },
        {
          line: line + 4,
          content: '  current: selectCurrentUser,',
        },
        {
          line: line + 5,
          content: '};',
        },
      ],
    },
    {
      file: 'src/store/getters.ts',
      line: 18,
      column: 14,
      function: 'currentUser',
      arguments: ['state'],
      sourceCode: [
        {
          line: 12,
          content: 'import { selectCurrentUser } from "./user";',
        },
        {
          line: 13,
          content: '',
        },
        {
          line: 14,
          content: 'export const getters = {',
        },
        {
          line: 15,
          content: '  workspace: (state) => state.workspaces.current,',
        },
        {
          line: 16,
          content: '  project: (state) => state.projects.current,',
        },
        {
          line: 17,
          content: '  currentUser: (state) => {',
        },
        {
          line: 18,
          content: '    return selectCurrentUser(state);',
        },
        {
          line: 19,
          content: '  },',
        },
        {
          line: 20,
          content: '};',
        },
      ],
    },
    {
      file: 'src/components/layout/UserMenu.vue',
      line: 67,
      column: 21,
      function: 'computed.currentUser',
      arguments: ['store'],
      sourceCode: [
        {
          line: 60,
          content: 'const store = useStore();',
        },
        {
          line: 61,
          content: 'const menuOpened = ref(false);',
        },
        {
          line: 62,
          content: 'const initials = computed(() => {',
        },
        {
          line: 63,
          content: '  return currentUser.value?.name?.slice(0, 2).toUpperCase();',
        },
        {
          line: 64,
          content: '});',
        },
        {
          line: 65,
          content: '',
        },
        {
          line: 66,
          content: 'const currentUser = computed(() => {',
        },
        {
          line: 67,
          content: '  return store.getters.currentUser;',
        },
        {
          line: 68,
          content: '});',
        },
        {
          line: 69,
          content: '',
        },
        {
          line: 70,
          content: 'function toggleMenu() {',
        },
        {
          line: 71,
          content: '  menuOpened.value = !menuOpened.value;',
        },
        {
          line: 72,
          content: '}',
        },
      ],
    },
    {
      file: 'src/components/layout/AppHeader.vue',
      line: 91,
      column: 11,
      function: 'renderUserMenu',
      arguments: ['workspace', 'project'],
      sourceCode: [
        {
          line: 84,
          content: '<template>',
        },
        {
          line: 85,
          content: '  <header class="app-header">',
        },
        {
          line: 86,
          content: '    <ProjectSwitcher :project="project" />',
        },
        {
          line: 87,
          content: '    <div class="app-header__right">',
        },
        {
          line: 88,
          content: '      <NotificationsBell />',
        },
        {
          line: 89,
          content: '      <UserMenu',
        },
        {
          line: 90,
          content: '        data-test="account-menu"',
        },
        {
          line: 91,
          content: '        :workspace="workspace"',
        },
        {
          line: 92,
          content: '      />',
        },
        {
          line: 93,
          content: '    </div>',
        },
        {
          line: 94,
          content: '  </header>',
        },
        {
          line: 95,
          content: '</template>',
        },
      ],
    },
    {
      file: 'src/App.vue',
      line: 61,
      column: 9,
      function: 'renderRootLayout',
      arguments: ['route', 'workspace'],
      sourceCode: [
        {
          line: 55,
          content: 'const workspace = computed(() => store.getters.workspace);',
        },
        {
          line: 56,
          content: 'const project = computed(() => store.getters.project);',
        },
        {
          line: 57,
          content: '',
        },
        {
          line: 58,
          content: 'watchEffect(async () => {',
        },
        {
          line: 59,
          content: '  if (!workspace.value) {',
        },
        {
          line: 60,
          content: '    return;',
        },
        {
          line: 61,
          content: '  await store.dispatch("FETCH_EVENTS", workspace.value.id);',
        },
        {
          line: 62,
          content: '});',
        },
        {
          line: 63,
          content: '',
        },
        {
          line: 64,
          content: 'return { workspace, project };',
        },
      ],
    },
    {
      file: 'src/main.ts',
      line: 22,
      column: 5,
      function: 'app.config.errorHandler',
      arguments: ['error', 'instance', 'info'],
      sourceCode: [
        {
          line: 17,
          content: 'const app = createApp(App);',
        },
        {
          line: 18,
          content: '',
        },
        {
          line: 19,
          content: 'app.config.errorHandler = (error, instance, info) => {',
        },
        {
          line: 20,
          content: '  const context = buildErrorContext(instance, info);',
        },
        {
          line: 21,
          content: '  hawk.send(error, {',
        },
        {
          line: 22,
          content: '    context, breadcrumbs: hawk.breadcrumbs.get(),',
        },
        {
          line: 23,
          content: '    addons: collectAddons(),',
        },
        {
          line: 24,
          content: '  });',
        },
        {
          line: 25,
          content: '};',
        },
      ],
    },
  ];
}

function createSourceCode(startLine: number, contents: string[]): DemoBacktraceFrame['sourceCode'] {
  return contents.map((content, index) => ({
    line: startLine + index,
    content,
  }));
}

function createPrimaryBacktraceFrame(file: string, line: number, type: string, title: string, projectId: string): DemoBacktraceFrame {
  const isSecondProject = projectId === DEMO_SECOND_PROJECT_ID;

  if (type === 'RateLimitError') {
    return {
      file,
      line,
      column: 15,
      function: isSecondProject ? 'sendTelemetryEnvelope' : 'sendBatch',
      arguments: isSecondProject ? ['envelope', 'networkState'] : ['batch', 'projectToken'],
      sourceCode: createSourceCode(line - 4, [
        isSecondProject ? 'export async function sendTelemetryEnvelope(envelope, networkState) {' : 'export async function sendBatch(batch, projectToken) {',
        isSecondProject ? '  const quota = await mobileLimits.getHourlyQuota(networkState.token);' : '  const envelope = normalizeEnvelope(batch);',
        isSecondProject ? '  const remaining = quota.limit - quota.used;' : '  const rateLimit = await limits.getProjectLimit(projectToken);',
        isSecondProject ? '  if (envelope.events.length > remaining) {' : '  if (envelope.events.length > rateLimit.remaining) {',
        isSecondProject ? '    throw new RateLimitError("Mobile ingest throughput exceeded");' : '    throw new RateLimitError("Project ingest quota exceeded");',
        '  }',
        isSecondProject ? '  return transport.sendMobile(envelope);' : '  return transport.send(envelope);',
        '}',
      ]),
    };
  }

  if (type === 'NetworkError') {
    return {
      file,
      line,
      column: 18,
      function: isSecondProject ? 'flushOfflineQueue' : 'loadUserData',
      arguments: isSecondProject ? ['queue', 'networkState'] : ['userId', 'abortSignal'],
      sourceCode: createSourceCode(line - 4, [
        isSecondProject ? 'export async function flushOfflineQueue(queue, networkState) {' : 'export async function loadUserData(userId, abortSignal) {',
        isSecondProject ? '  const envelope = queue.peekBatch();' : '  const request = createProfileRequest(userId);',
        isSecondProject ? '  const retryPolicy = getMobileRetryPolicy(networkState);' : '  const retryPolicy = getProfileRetryPolicy(userId);',
        isSecondProject ? '  return retryRequest(() => {' : '  return retryRequest(() => {',
        isSecondProject ? '    return mobileApi.post("/sync", envelope, retryPolicy);' : '    return http.get(request.url, { timeout: 30000, signal: abortSignal });',
        isSecondProject ? '  queue.markDelivered(envelope.id);' : '  return normalizeUser(response.data.user);',
        isSecondProject ? '  return response;' : '}',
      ]),
    };
  }

  if (type === 'ReferenceError') {
    return {
      file,
      line,
      column: 11,
      function: title.includes('pushToken') ? 'bootstrapPushNotifications' : 'resolveApiKey',
      arguments: title.includes('pushToken') ? ['device', 'permissions'] : ['runtimeConfig'],
      sourceCode: createSourceCode(line - 4, [
        title.includes('pushToken') ? 'export function bootstrapPushNotifications(device, permissions) {' : 'export function resolveApiKey(runtimeConfig) {',
        title.includes('pushToken') ? '  if (!permissions.notifications) {' : '  const config = runtimeConfig.public;',
        title.includes('pushToken') ? '    return null;' : '  const token = config.apiKey || window.HAWK_API_KEY;',
        title.includes('pushToken') ? '  }' : '  if (!token) {',
        title.includes('pushToken') ? '  return pushToken.value;' : '    return apiKey.trim();',
        title.includes('pushToken') ? '}' : '  }',
        title.includes('pushToken') ? '' : '  return token;',
        title.includes('pushToken') ? '' : '}',
      ]),
    };
  }

  if (type === 'SyntaxError') {
    return {
      file,
      line,
      column: 20,
      function: isSecondProject ? 'restorePersistedState' : 'parseJsonResponse',
      arguments: isSecondProject ? ['rawState'] : ['responseText', 'requestId'],
      sourceCode: createSourceCode(line - 4, [
        isSecondProject ? 'export function restorePersistedState(rawState) {' : 'export function parseJsonResponse(responseText, requestId) {',
        isSecondProject ? '  if (!rawState) {' : '  const trimmed = responseText.trim();',
        isSecondProject ? '    return defaultMobileState();' : '  if (trimmed.startsWith("<")) {',
        isSecondProject ? '  }' : '    logger.warn("Expected JSON but received HTML", requestId);',
        isSecondProject ? '  const parsed = JSON.parse(rawState);' : '  return JSON.parse(trimmed);',
        isSecondProject ? '  return migrateState(parsed);' : '  return JSON.parse(trimmed);',
        '}',
      ]),
    };
  }

  if (type === 'RangeError') {
    return {
      file,
      line,
      column: 27,
      function: title.includes('date') ? 'formatReleaseDate' : 'serializePayload',
      arguments: title.includes('date') ? ['releaseTimestamp', 'locale'] : ['payload', 'seen'],
      sourceCode: createSourceCode(line - 4, [
        title.includes('date') ? 'export function formatReleaseDate(releaseTimestamp, locale) {' : 'export function serializePayload(payload, seen = new WeakSet()) {',
        title.includes('date') ? '  const date = new Date(releaseTimestamp);' : '  if (payload && typeof payload === "object") {',
        title.includes('date') ? '  const formatter = new Intl.DateTimeFormat(locale);' : '    if (seen.has(payload)) {',
        title.includes('date') ? '  if (Number.isNaN(date.getTime())) {' : '      logger.debug("Circular payload detected");',
        title.includes('date') ? '    return formatter.format(date);' : '      return serializePayload(payload.parent, seen);',
        title.includes('date') ? '' : '    seen.add(payload);',
        title.includes('date') ? '' : '  }',
        title.includes('date') ? '' : '  return JSON.stringify(payload);',
      ]),
    };
  }

  return {
    file,
    line,
    column: 15,
    function: title.includes('appendChild') ? 'mountModalContent' : isSecondProject ? 'resolveNavigationState' : 'renderProfileCard',
    arguments: title.includes('appendChild') ? ['target', 'content'] : isSecondProject ? ['navigation'] : ['profile', 'settings'],
    sourceCode: createSourceCode(line - 4, [
      title.includes('appendChild') ? 'export function mountModalContent(target, content) {' : isSecondProject ? 'export function resolveNavigationState(navigation) {' : 'export function renderProfileCard(profile, settings) {',
      title.includes('appendChild') ? '  const container = resolveModalContainer(target);' : isSecondProject ? '  if (!navigation.state) {' : '  if (!profile) {',
      title.includes('appendChild') ? '  const node = content.el;' : isSecondProject ? '    return fallbackRoute();' : '    return null;',
      title.includes('appendChild') ? '  if (!container) {' : isSecondProject ? '  }' : '  }',
      title.includes('appendChild') ? '  container.appendChild(content.el);' : isSecondProject ? '  const currentRoute = navigation.state.routes.at(-1);' : '  const { name, avatar } = profile;',
      title.includes('appendChild') ? '}' : isSecondProject ? '  return hydrateRoute(currentRoute.name, currentRoute.params);' : '  return createProfileView(name, avatar, settings.theme);',
      '}',
    ]),
  };
}

function createDemoBacktrace(file: string, line: number, type: string, title: string, projectId: string): HawkEvent['payload']['backtrace'] {
  if (isUserStateTypeError({
    projectId,
    eventType: type,
    title,
    timestamp: 0,
  })) {
    return createUserStateTypeErrorBacktrace(file, line);
  }

  const isSecondProject = projectId === DEMO_SECOND_PROJECT_ID;

  return [
    createPrimaryBacktraceFrame(file, line, type, title, projectId),
    {
      file: isSecondProject ? 'src/mobile/offline/syncQueue.ts' : 'src/store/modules/events/index.ts',
      line: isSecondProject ? 211 : 184,
      column: 23,
      function: isSecondProject ? 'flushOfflineQueue' : 'loadProjectEvents',
      arguments: isSecondProject ? ['queue', 'networkState'] : ['projectId', 'filters'],
      sourceCode: [
        {
          line: isSecondProject ? 207 : 180,
          content: isSecondProject ? 'export async function flushOfflineQueue(queue, networkState) {' : 'export async function loadProjectEvents(projectId, filters) {',
        },
        {
          line: isSecondProject ? 208 : 181,
          content: isSecondProject ? '  if (!networkState.online) {' : '  const normalizedFilters = normalizeFilters(filters);',
        },
        {
          line: isSecondProject ? 209 : 182,
          content: isSecondProject ? '    return queue.deferUntilOnline();' : '  const response = await eventsApi.fetchDailyEventsPortion(',
        },
        {
          line: isSecondProject ? 210 : 183,
          content: isSecondProject ? '  }' : '    projectId, normalizedFilters',
        },
        {
          line: isSecondProject ? 211 : 184,
          content: isSecondProject ? '  return telemetry.sendBatch(queue.drain(), networkState.token);' : '  );',
        },
        {
          line: isSecondProject ? 212 : 185,
          content: isSecondProject ? '}' : '  return response.dailyEvents.map(mapEvent);',
        },
      ],
    },
    {
      file: isSecondProject ? 'src/mobile/telemetry/send.ts' : 'src/api/events/index.ts',
      line: isSecondProject ? 79 : 87,
      column: 18,
      function: isSecondProject ? 'sendTelemetryEnvelope' : 'fetchDailyEventsPortion',
      arguments: isSecondProject ? ['envelope'] : ['projectId', 'cursor', 'sort', 'filters'],
      sourceCode: [
        {
          line: isSecondProject ? 75 : 83,
          content: isSecondProject ? 'export async function sendTelemetryEnvelope(envelope) {' : 'export async function fetchDailyEventsPortion(projectId, cursor, sort, filters) {',
        },
        {
          line: isSecondProject ? 76 : 84,
          content: isSecondProject ? '  const headers = buildTelemetryHeaders(envelope);' : '  const response = await api.callOld(QUERY_DAILY_EVENTS_PORTION, {',
        },
        {
          line: isSecondProject ? 77 : 85,
          content: isSecondProject ? '  const response = await fetch("/api/mobile/events", {' : '    projectId, nextCursor: cursor, sort, filters,',
        },
        {
          line: isSecondProject ? 78 : 86,
          content: isSecondProject ? '    method: "POST", headers, body: JSON.stringify(envelope),' : '  });',
        },
        {
          line: isSecondProject ? 79 : 87,
          content: isSecondProject ? '  });' : '  return response.dailyEventsPortion;',
        },
        {
          line: isSecondProject ? 80 : 88,
          content: isSecondProject ? '  return parseTelemetryResponse(response);' : '}',
        },
      ],
    },
    {
      file: isSecondProject ? 'src/mobile/App.vue' : 'src/App.vue',
      line: isSecondProject ? 58 : 61,
      column: 9,
      function: isSecondProject ? 'setup' : 'watchEffect',
      arguments: ['route', 'workspace'],
      sourceCode: [
        {
          line: isSecondProject ? 54 : 57,
          content: isSecondProject ? 'const workspace = useDemoWorkspace();' : 'const workspace = computed(() => store.getters.currentWorkspace);',
        },
        {
          line: isSecondProject ? 55 : 58,
          content: isSecondProject ? 'const syncQueue = useOfflineQueue(workspace.value);' : 'watchEffect(async () => {',
        },
        {
          line: isSecondProject ? 56 : 59,
          content: isSecondProject ? 'onMounted(async () => {' : '  if (!workspace.value) {',
        },
        {
          line: isSecondProject ? 57 : 60,
          content: isSecondProject ? '  await syncQueue.flush();' : '    return;',
        },
        {
          line: isSecondProject ? 58 : 61,
          content: isSecondProject ? '});' : '  await store.dispatch("FETCH_EVENTS", workspace.value.id);',
        },
        {
          line: isSecondProject ? 59 : 62,
          content: isSecondProject ? 'return { workspace, syncQueue };' : '});',
        },
      ],
    },
    {
      file: isSecondProject ? 'src/mobile/bootstrap.ts' : 'src/main.ts',
      line: isSecondProject ? 33 : 22,
      column: 5,
      function: isSecondProject ? 'bootstrapMobileDemo' : 'app.config.errorHandler',
      arguments: ['error', 'instance', 'info'],
      sourceCode: [
        {
          line: isSecondProject ? 29 : 18,
          content: isSecondProject ? 'export function bootstrapMobileDemo(app) {' : 'app.config.errorHandler = (error, instance, info) => {',
        },
        {
          line: isSecondProject ? 30 : 19,
          content: isSecondProject ? '  app.use(router);' : '  const context = buildErrorContext(instance, info);',
        },
        {
          line: isSecondProject ? 31 : 20,
          content: isSecondProject ? '  app.use(store);' : '  hawk.send(error, {',
        },
        {
          line: isSecondProject ? 32 : 21,
          content: isSecondProject ? '  app.mount("#app");' : '    context, breadcrumbs: hawk.breadcrumbs.get(),',
        },
        {
          line: isSecondProject ? 33 : 22,
          content: isSecondProject ? '}' : '  });',
        },
        {
          line: isSecondProject ? 34 : 23,
          content: isSecondProject ? '' : '};',
        },
      ],
    },
  ];
}

/**
 * Helper to create realistic error event
 * @param config
 */
function createDemoEvent(config: {
  id: string;
  originalEventId: string;
  title: string;
  type: string;
  groupHash: string;
  totalCount: number;
  usersAffected: number;
  timestamp?: number;
  file?: string;
  line?: number;
  isStarred?: boolean;
  isResolved?: boolean;
  isIgnored?: boolean;
  visitedBy?: User[];
  projectId?: string;
}): HawkEvent {
  const {
    id,
    originalEventId,
    title,
    type,
    groupHash,
    totalCount,
    usersAffected,
    timestamp = Math.floor(Date.now() / MILLISECONDS_IN_SECOND),
    file = 'src/store/user.ts',
    line = 42,
    isStarred = false,
    isResolved = false,
    isIgnored = false,
    visitedBy = [],
    projectId = DEMO_PROJECT_ID,
  } = config;
  const scaledTotalCount = getScaledTotalCount(totalCount, type, projectId);
  const scaledUsersAffected = getScaledUsersAffected(usersAffected, scaledTotalCount, projectId);
  const contextPayload = {
    projectId,
    eventType: type,
    title,
    timestamp,
  };

  const event: HawkEvent = {
    id,
    groupHash,
    totalCount: scaledTotalCount,
    usersAffected: scaledUsersAffected,
    visitedBy,
    marks: {
      resolved: isResolved,
      starred: isStarred,
      ignored: isIgnored,
    },
    payload: {
      title,
      type,
      backtrace: createDemoBacktrace(file, line, type, title, projectId),
      get: {
        userId: '507f1f77bcf86cd799439011',
        format: 'json',
      },
      post: {},
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      release: 'v1.2.3',
      user: DEMO_AFFECTED_USER as any,
      context: createDemoContext(contextPayload),
      addons: createDemoAddons(contextPayload) as any,
      breadcrumbs: createDemoBreadcrumbs(contextPayload),
    },
    catcherType: 'client/javascript',
    repetitions: [],
    assignee: undefined as any,
    timestamp,
    originalTimestamp: timestamp - SECONDS_IN_DAY,
    originalEventId,
  };

  DEMO_EVENT_PROJECT_ID_BY_ID.set(event.id, projectId);

  return event;
}

/**
 * Demo events collection
 */
export const DEMO_EVENTS: HawkEvent[] = [
  createDemoEvent({
    id: '507f1f77bcf86cd799439011',
    originalEventId: '507f1f77bcf86cd799439010',
    title: 'TypeError: Cannot read property \'user\' of undefined',
    type: 'TypeError',
    groupHash: 'hash-507f1f77bcf86cd799439011',
    totalCount: 42,
    usersAffected: 8,
    isStarred: true,
    timestamp: NOW_SECONDS - 7 * SECONDS_IN_MINUTE,
  }),
  createDemoEvent({
    id: '507f191e810c19729de860ea',
    originalEventId: '507f191e810c19729de860e9',
    title: 'ReferenceError: apiKey is not defined',
    type: 'ReferenceError',
    groupHash: 'hash-507f191e810c19729de860ea',
    totalCount: 18,
    usersAffected: 5,
    file: 'src/api/config.ts',
    line: 15,
    isResolved: true,
    timestamp: NOW_SECONDS - 49 * SECONDS_IN_MINUTE,
  }),
  createDemoEvent({
    id: '507f1f77bcf86cd799439012',
    originalEventId: '507f1f77bcf86cd799439013',
    title: 'Network Error: Failed to fetch user data',
    type: 'NetworkError',
    groupHash: 'hash-507f1f77bcf86cd799439012',
    totalCount: 7,
    usersAffected: 3,
    file: 'src/api/user/index.ts',
    line: 28,
    timestamp: NOW_SECONDS - 3 * SECONDS_IN_HOUR,
  }),
  createDemoEvent({
    id: '507f1f77bcf86cd799439014',
    originalEventId: '507f1f77bcf86cd799439015',
    title: 'SyntaxError: Unexpected token < in JSON',
    type: 'SyntaxError',
    groupHash: 'hash-507f1f77bcf86cd799439014',
    totalCount: 12,
    usersAffected: 4,
    file: 'src/utils/parser.ts',
    line: 55,
    isIgnored: true,
    visitedBy: [DEMO_USER],
    timestamp: NOW_SECONDS - 9 * SECONDS_IN_HOUR,
  }),
  ...[
    {
      title: 'TypeError: Cannot destructure property \"profile\" of null',
      type: 'TypeError',
      file: 'src/components/account/ProfileCard.vue',
      line: 73,
      totalCount: 26,
      usersAffected: 7,
      isStarred: true,
    },
    {
      title: 'Network Error: request timeout while loading dashboard',
      type: 'NetworkError',
      file: 'src/api/projects/index.js',
      line: 114,
      totalCount: 31,
      usersAffected: 11,
    },
    {
      title: 'RateLimitError: Too many requests to /events endpoint',
      type: 'RateLimitError',
      file: 'src/api/events/index.ts',
      line: 87,
      totalCount: 9,
      usersAffected: 5,
      isIgnored: true,
    },
    {
      title: 'ReferenceError: config is not defined in init script',
      type: 'ReferenceError',
      file: 'src/main.ts',
      line: 22,
      totalCount: 14,
      usersAffected: 4,
    },
    {
      title: 'RangeError: Maximum call stack size exceeded in serializer',
      type: 'RangeError',
      file: 'src/utils/serializer.ts',
      line: 129,
      totalCount: 19,
      usersAffected: 6,
    },
    {
      title: 'TypeError: Failed to execute \"appendChild\" on \"Node\"',
      type: 'TypeError',
      file: 'src/components/modals/BaseModal.vue',
      line: 101,
      totalCount: 23,
      usersAffected: 9,
      isResolved: true,
    },
    {
      title: 'RateLimitError: Ingestion quota exceeded for project token',
      type: 'RateLimitError',
      file: 'src/api/index.ts',
      line: 438,
      totalCount: 12,
      usersAffected: 3,
    },
    {
      title: 'SyntaxError: Unexpected end of JSON input',
      type: 'SyntaxError',
      file: 'src/store/modules/events/index.ts',
      line: 241,
      totalCount: 8,
      usersAffected: 4,
      isResolved: true,
    },
  ].flatMap((template, index) => {
    const minuteOffsets = [
      75,
      115,
      170,
      260,
      360,
      510,
      720,
      960,
      1410,
      1890,
      2520,
      3360,
      4290,
      5370,
      6960,
      8400,
      10080,
      12180,
      14640,
      17220,
      20160,
      23040,
      25920,
      28800,
      31680,
      34560,
      37440,
      40320,
      41760,
    ];

    return minuteOffsets
      .filter((_, offsetIndex) => offsetIndex % 8 === index)
      .map((offsetMinutes, offsetIndex) => {
        const sequence = index * 10 + offsetIndex;
        const idSuffix = String(1000 + sequence).padStart(4, '0');
        const originalSuffix = String(2000 + sequence).padStart(4, '0');
        const totalCount = template.totalCount + (offsetIndex % 3) * 4;
        const usersAffected = Math.max(1, Math.min(totalCount, template.usersAffected + (offsetIndex % 2)));

        return createDemoEvent({
          id: `507f1f77bcf86cd79944${idSuffix}`,
          originalEventId: `507f1f77bcf86cd79945${originalSuffix}`,
          title: template.title,
          type: template.type,
          groupHash: `hash-507f1f77bcf86cd79944${idSuffix}`,
          totalCount,
          usersAffected,
          file: template.file,
          line: template.line,
          isStarred: Boolean(template.isStarred),
          isResolved: Boolean(template.isResolved),
          isIgnored: Boolean(template.isIgnored),
          timestamp: NOW_SECONDS - offsetMinutes * SECONDS_IN_MINUTE,
        });
      });
  }),
  ...[
    {
      title: 'TypeError: undefined is not an object (evaluating \"navigation.state.routes\")',
      type: 'TypeError',
      file: 'src/mobile/navigation/router.ts',
      line: 143,
      totalCount: 34,
      usersAffected: 16,
      isStarred: true,
    },
    {
      title: 'Network Error: timeout reached while syncing offline queue',
      type: 'NetworkError',
      file: 'src/mobile/offline/syncQueue.ts',
      line: 211,
      totalCount: 56,
      usersAffected: 27,
    },
    {
      title: 'RateLimitError: mobile ingest throughput exceeded',
      type: 'RateLimitError',
      file: 'src/mobile/telemetry/send.ts',
      line: 79,
      totalCount: 22,
      usersAffected: 8,
      isIgnored: true,
    },
    {
      title: 'ReferenceError: pushToken is not defined in notifications bootstrap',
      type: 'ReferenceError',
      file: 'src/mobile/push/bootstrap.ts',
      line: 41,
      totalCount: 18,
      usersAffected: 10,
      isResolved: true,
    },
    {
      title: 'SyntaxError: JSON Parse error: Unexpected EOF',
      type: 'SyntaxError',
      file: 'src/mobile/storage/restoreState.ts',
      line: 63,
      totalCount: 27,
      usersAffected: 12,
    },
    {
      title: 'RangeError: Invalid time value while formatting release date',
      type: 'RangeError',
      file: 'src/mobile/utils/date.ts',
      line: 58,
      totalCount: 16,
      usersAffected: 7,
    },
  ].flatMap((template, index) => {
    const minuteOffsets = [
      12,
      19,
      26,
      34,
      43,
      57,
      69,
      85,
      101,
      130,
      164,
      211,
      269,
      345,
      447,
      576,
      743,
      957,
      1242,
      1610,
      2098,
      2730,
      3520,
      4560,
      5840,
      7440,
      9360,
      11760,
      14640,
      18000,
      21600,
      25200,
      28800,
      32400,
      36000,
      39600,
      41700,
    ];

    return minuteOffsets
      .filter((_, offsetIndex) => offsetIndex % 6 === index)
      .map((offsetMinutes, offsetIndex) => {
        const sequence = index * 20 + offsetIndex;
        const idSuffix = String(3000 + sequence).padStart(4, '0');
        const originalSuffix = String(4000 + sequence).padStart(4, '0');
        const totalCount = template.totalCount + (offsetIndex % 4) * 5;
        const usersAffected = Math.max(1, Math.min(totalCount, template.usersAffected + (offsetIndex % 3)));

        return createDemoEvent({
          id: `607f1f77bcf86cd79944${idSuffix}`,
          originalEventId: `607f1f77bcf86cd79945${originalSuffix}`,
          title: template.title,
          type: template.type,
          groupHash: `hash-607f1f77bcf86cd79944${idSuffix}`,
          totalCount,
          usersAffected,
          file: template.file,
          line: template.line,
          isStarred: Boolean(template.isStarred),
          isResolved: Boolean(template.isResolved),
          isIgnored: Boolean(template.isIgnored),
          timestamp: NOW_SECONDS - offsetMinutes * SECONDS_IN_MINUTE,
          projectId: DEMO_SECOND_PROJECT_ID,
        });
      });
  }),
];

/**
 * Returns events for specific project in demo mode
 * @param projectId
 */
export function getDemoEventsByProjectId(projectId?: string): HawkEvent[] {
  if (!projectId) {
    return DEMO_EVENTS;
  }

  return DEMO_EVENTS.filter((event) => {
    return DEMO_EVENT_PROJECT_ID_BY_ID.get(event.id) === projectId;
  });
}

/**
 * Get event by ID
 * @param id
 */
export function getDemoEventById(id: string): HawkEvent | undefined {
  return DEMO_EVENTS.find(event => event.id === id);
}
