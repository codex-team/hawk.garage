<template>
  <PopupDialog @close="$emit('close')">
    <div class="event-limit-modal">
      <h2 class="event-limit-modal__title">
        {{ $t('event.limit.title') }}
      </h2>
      <p class="event-limit-modal__description">
        {{ $t('event.limit.description') }}
      </p>
      <div class="event-limit-modal__actions">
        <UiButton :content="$t('event.limit.upgradeButton')" submit @click="upgradePlan" />
      </div>
    </div>
  </PopupDialog>
</template>

<script lang="ts">
import Vue from 'vue';
import PopupDialog from '../utils/PopupDialog.vue';
import UiButton from '../utils/UiButton.vue';
import { SET_MODAL_DIALOG } from '@/store/modules/modalDialog/actionTypes';
import { FETCH_PLANS } from '@/store/modules/plans/actionTypes';
export default Vue.extend({
  name: 'EventLimitModal',
  components: {
    PopupDialog,
    UiButton,
  },
  props: {
    /**
     * Workspace id
     */
    workspaceId: {
      type: String,
      required: true,
    },
  },
  methods: {
    /**
     * Open tariff plan selection dialog
     */
    upgradePlan() {
      this.$store.dispatch(FETCH_PLANS).then(() => {
        this.$store.dispatch(SET_MODAL_DIALOG, {
          component: 'ChooseTariffPlanPopup',
          data: {
            workspaceId: this.workspaceId,
          },
        });
      });
      this.$emit('close');
    },
  },
});
</script>

<style>
.event-limit-modal {
  max-width: 500px;
  padding: 40px;
  text-align: center;
  &__title {
    margin: 0 0 15px;
    font-weight: bold;
    font-size: 20px;
    color: var(--color-text-main);
  }
  &__description {
    margin: 0 0 30px;
    color: var(--color-text-second);
    font-size: 14px;
    line-height: 1.5;
  }
  &__actions {
    display: flex;
    gap: 15px;
    justify-content: center;
  }
}
</style>
