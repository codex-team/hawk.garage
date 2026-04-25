<template>
  <ContextMenu
    class="event-actions-menu"
    :items="menuItems"
  />
</template>

<script lang="ts">
import { REMOVE_EVENT } from '@/store/modules/events/actionTypes';
import { ContextMenu, ContextMenuItem } from '@codexteam/ui/vue';
import notifier from 'codex-notifier';
import { defineComponent, PropType } from 'vue';
import { i18n } from '../../i18n';
import { ActionType } from '../utils/ConfirmationWindow/types';

export default defineComponent({
  name: 'EventActionsMenu',
  components: {
    ContextMenu,
  },
  props: {
    /**
     * Project id the event belongs to
     */
    projectId: {
      type: String,
      required: true,
    },
    /**
     * Original event id to remove
     */
    eventId: {
      type: String,
      required: true,
    },
    /**
     * Callback to close popover
     */
    onClose: {
      type: Function as PropType<() => void>,
      default: null,
    },
  },
  computed: {
    /**
     * Actions available in event context menu
     */
    menuItems(): ContextMenuItem[] {
      return [
        {
          type: 'default',
          title: i18n.global.t('event.remove') as string,
          icon: 'Trash',
          onActivate: () => {
            this.onClose?.();
            this.confirmRemoveEvent();
          },
        },
      ];
    },
  },
  methods: {
    /**
     * Show confirmation dialog and remove event on confirm
     */
    confirmRemoveEvent() {
      this.$confirm.open({
        description: i18n.global.t('event.removeConfirmation').toString(),
        actionType: ActionType.DELETION,
        continueButtonText: i18n.global.t('event.removeButton').toString(),
        onConfirm: async () => {
          const isRemoved = await this.$store.dispatch(REMOVE_EVENT, {
            projectId: this.projectId,
            eventId: this.eventId,
          });

          if (isRemoved) {
            notifier.show({
              message: i18n.global.t('event.removeSuccess').toString(),
              style: 'success',
              time: 5000,
            });
            this.$router.push({
              name: 'project-overview',
              params: { projectId: this.projectId },
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
    },
  },
});
</script>

<style scoped>
.event-actions-menu {
  min-width: 140px;
}
</style>
