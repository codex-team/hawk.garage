import {
  FETCH_EVENT,
  BULK_TOGGLE_EVENT_MARKS,
  BULK_UPDATE_EVENT_ASSIGNEE,
  BULK_VISIT_EVENTS,
} from '../../../store/modules/events/actionTypes';
import type { BulkAssigneeUser, BulkSelectedEvent, MarkAction } from '@/types/bulk';

const BULK_ERROR_TIMEOUT_MS = 8000;
const BULK_PARTIAL_TIMEOUT_MS = 10000;

type BulkActionResult = {
  modifiedCount: number;
  targetEventIds?: string[];
} | null;

type BulkNotifyPayload = {
  message: string;
  style: string;
  time: number;
};

type BulkDispatch = <TResult = unknown>(
  actionType: string,
  payload: Record<string, unknown>
) => Promise<TResult>;

type BulkActionContext = {
  dispatch: BulkDispatch;
  projectId: string;
  t: (key: string, params?: Record<string, unknown>) => string;
  notify: (payload: BulkNotifyPayload) => void;
  refreshByOriginalIds: (targetOriginalIds: string[]) => Promise<void>;
};

type RefreshEventsContext = {
  dispatch: BulkDispatch;
  projectId: string;
  selectedEvents: BulkSelectedEvent[];
};

/**
 * Resolve target ids from result payload or fallback to requested ids.
 *
 * @param result Bulk action result returned by store action
 * @param targetOriginalIds Requested original event ids
 */
function getTargetEventIds(result: BulkActionResult, targetOriginalIds: string[]): string[] {
  if (Array.isArray(result?.targetEventIds)) {
    return result.targetEventIds;
  }

  return targetOriginalIds;
}

/**
 * Execute one bulk action, show error/partial notifications, and refresh stale rows.
 *
 * @param ctx Shared action context
 * @param actionType Vuex action type
 * @param payload Additional payload to pass into action dispatch
 * @param targetOriginalIds Original event ids targeted by action
 */
async function executeBulkActionWithRecovery(
  ctx: BulkActionContext,
  actionType: string,
  payload: Record<string, unknown>,
  targetOriginalIds: string[]
): Promise<BulkActionResult> {
  const result = await ctx.dispatch<BulkActionResult>(actionType, {
    projectId: ctx.projectId,
    eventIds: targetOriginalIds,
    ...payload,
  });

  if (!result) {
    ctx.notify({
      message: ctx.t('event.bulk.markError'),
      style: 'error',
      time: BULK_ERROR_TIMEOUT_MS,
    });
    await ctx.refreshByOriginalIds(targetOriginalIds);

    return null;
  }

  const targetEventIds = getTargetEventIds(result, targetOriginalIds);
  const attemptedCount = targetEventIds.length;
  const failedCount = Math.max(0, attemptedCount - result.modifiedCount);

  if (result.modifiedCount < attemptedCount) {
    ctx.notify({
      message: ctx.t('event.bulk.markPartial', {
        updated: result.modifiedCount,
        failed: failedCount,
      }),
      style: 'error',
      time: BULK_PARTIAL_TIMEOUT_MS,
    });
    await ctx.refreshByOriginalIds(targetEventIds);
  }

  return result;
}

/**
 * Refetch selected events by original ids to restore consistent UI state.
 *
 * @param ctx Refresh context for dispatching and resolving selected rows
 * @param originalIds Original event ids that should be refreshed
 */
export async function refreshEventsByOriginalIds(
  ctx: RefreshEventsContext,
  originalIds: string[] = []
): Promise<void> {
  const originalIdsSet = new Set((originalIds || []).map(String));

  if (originalIdsSet.size === 0) {
    return;
  }

  const targetsByOriginalId = new Map<string, { eventId: string; originalEventId: string }>();

  ctx.selectedEvents.forEach((event) => {
    if (!event?.originalEventId) {
      return;
    }

    const originalEventId = String(event.originalEventId);

    if (!originalIdsSet.has(originalEventId) || targetsByOriginalId.has(originalEventId)) {
      return;
    }

    targetsByOriginalId.set(originalEventId, {
      eventId: String(event.id || originalEventId),
      originalEventId,
    });
  });

  const refreshTargets = Array.from(targetsByOriginalId.values());

  if (refreshTargets.length === 0) {
    return;
  }

  await Promise.allSettled(refreshTargets.map(({ eventId, originalEventId }) => {
    return ctx.dispatch<void>(FETCH_EVENT, {
      projectId: ctx.projectId,
      eventId,
      originalEventId,
    });
  }));
}

/**
 * Execute bulk mark toggle action.
 *
 * @param ctx Shared bulk action context
 * @param mark Requested mark action
 * @param targetOriginalIds Target original event ids
 */
export async function runBulkMarkAction(
  ctx: BulkActionContext,
  mark: MarkAction,
  targetOriginalIds: string[]
): Promise<BulkActionResult> {
  return executeBulkActionWithRecovery(ctx, BULK_TOGGLE_EVENT_MARKS, { mark }, targetOriginalIds);
}

/**
 * Execute bulk assignee update action.
 *
 * @param ctx Shared bulk action context
 * @param assignee User to assign (or null to clear)
 * @param targetOriginalIds Target original event ids
 */
export async function runBulkAssigneeAction(
  ctx: BulkActionContext,
  assignee: BulkAssigneeUser,
  targetOriginalIds: string[]
): Promise<BulkActionResult> {
  return executeBulkActionWithRecovery(ctx, BULK_UPDATE_EVENT_ASSIGNEE, { assignee }, targetOriginalIds);
}

/**
 * Execute bulk "mark viewed" action.
 *
 * @param ctx Shared bulk action context
 * @param targetOriginalIds Target original event ids
 */
export async function runBulkViewedAction(
  ctx: BulkActionContext,
  targetOriginalIds: string[]
): Promise<BulkActionResult> {
  return executeBulkActionWithRecovery(ctx, BULK_VISIT_EVENTS, {}, targetOriginalIds);
}
