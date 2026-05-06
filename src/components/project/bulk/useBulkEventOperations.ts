import {
  FETCH_EVENT
} from '../../../store/modules/events/actionTypes';
import type {
  BulkActionContext,
  BulkActionPayload,
  BulkActionType,
  BulkActionResult,
  RefreshEventsContext
} from '@/types/bulk';

/**
 * Execute one bulk action and refresh stale rows on error result.
 * @param ctx Shared action context
 * @param actionType Vuex action type
 * @param payload Additional payload to pass into action dispatch
 * @param targetOriginalIds Original event ids targeted by action
 */
async function executeBulkAction(
  ctx: BulkActionContext,
  actionType: BulkActionType,
  payload: BulkActionPayload,
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
    });
    await ctx.refreshByOriginalIds(targetOriginalIds);

    return null;
  }

  return result;
}

/**
 * Refetch selected events by original ids to restore consistent UI state.
 * @param ctx Refresh context for dispatching and resolving selected rows
 * @param originalIds Original event ids that should be refreshed
 */
async function refreshEventsByOriginalIds(
  ctx: RefreshEventsContext,
  originalIds: string[] = []
): Promise<void> {
  const originalIdsSet = new Set(originalIds.map(String));

  if (originalIdsSet.size === 0) {
    return;
  }

  const targetsByOriginalId = new Map<string, { eventId: string;
    originalEventId: string; }>();

  ctx.selectedEvents.forEach((event) => {
    if (event?.originalEventId == null || event.originalEventId === '') {
      return;
    }

    const originalEventId = String(event.originalEventId);

    if (!originalIdsSet.has(originalEventId) || targetsByOriginalId.has(originalEventId)) {
      return;
    }

    targetsByOriginalId.set(originalEventId, {
      eventId: String(event.id ?? originalEventId),
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
 * Composable that provides helpers for bulk event actions.
 * Keeps all bulk side-effects in one place.
 */
export function useBulkEventOperations(): {
  executeBulkAction: typeof executeBulkAction;
  refreshEventsByOriginalIds: typeof refreshEventsByOriginalIds;
} {
  return {
    executeBulkAction,
    refreshEventsByOriginalIds,
  };
}
