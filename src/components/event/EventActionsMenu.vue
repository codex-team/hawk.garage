<template>
  <ContextMenu
    class="event-actions-menu"
    :items="menuItems"
  />
</template>

<script setup lang="ts">
import { REMOVE_EVENT } from '@/store/modules/events/actionTypes';
import { ContextMenu, type ContextMenuItem } from '@codexteam/ui/vue';
import notifier from 'codex-notifier';
import { computed, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { i18n } from '../../i18n';
import { ActionType } from '../utils/ConfirmationWindow/types';

interface Props {
  /**
   * Project id the event belongs to
   */
  projectId: string;
  /**
   * Original event id to remove
   */
  eventId: string;
  /**
   * Callback to close popover
   */
  onClose?: () => void;
}

const props = defineProps<Props>();

const store = useStore();
const router = useRouter();
const instance = getCurrentInstance();

/**
 * Show confirmation dialog and remove event on confirm
 */
function confirmRemoveEvent(): void {
  if (!instance?.appContext.config.globalProperties.$confirm) {
    return;
  }

  instance.appContext.config.globalProperties.$confirm.open({
    description: i18n.global.t('event.removeConfirmation').toString(),
    actionType: ActionType.DELETION,
    continueButtonText: i18n.global.t('event.removeButton').toString(),
    onConfirm: async () => {
      const isRemoved = await store.dispatch(REMOVE_EVENT, {
        projectId: props.projectId,
        eventId: props.eventId,
      });

      if (isRemoved) {
        notifier.show({
          message: i18n.global.t('event.removeSuccess').toString(),
          style: 'success',
          time: 5000,
        });
        router.push({
          name: 'project-overview',
          params: { projectId: props.projectId },
          query: { reload: String(Date.now()) },
        });

        return;
      }

      notifier.show({
        message: i18n.global.t('errors.Something went wrong').toString(),
        style: 'error',
        time: 5000,
      });
    },
  });
}

/**
 * Actions available in event context menu
 */
const menuItems = computed<ContextMenuItem[]>(() => {
  return [
    {
      type: 'default',
      title: i18n.global.t('event.remove') as string,
      icon: 'Trash',
      onActivate: () => {
        props.onClose?.();
        confirmRemoveEvent();
      },
    },
  ];
});
</script>

<style scoped>
.event-actions-menu {
  min-width: 140px;
}
</style>
