<template>
  <div class="blocked-workspace-banner">
    <div v-html="blockedBannerText" class="blocked-workspace-banner__header"></div>
    <div>{{ $t('workspaces.blocked.description') }}</div>
    <UiButton
      :content="$t('workspaces.blocked.incrementLimit')"
      class="blocked-workspace-banner__button"
      submit
      @click="incrementEventsLimit"
    />
  </div>
</template>

<script>
import UiButton from './UiButton.vue';
import { SET_MODAL_DIALOG } from '../../store/modules/modalDialog/actionTypes';
import { FETCH_PLANS } from '../../store/modules/plans/actionTypes';

export default {
  name: 'BlockedWorkspaceBanner',
  components: {
    UiButton,
  },
  props: {
    /**
     * Workspace name
     */
    workspaceName: {
      type: String,
      required: true,
    },
    /**
     * Workspace id
     */
    workspaceId: {
      type: String,
      required: true,
    },
  },
  computed: {
    /**
     * Text for the blocked banner
     */
    blockedBannerText() {
      return this.$t('workspaces.blocked.banner', { workspaceName: this.workspaceName });
    },
  },
  methods: {
    incrementEventsLimit() {
      this.$store.dispatch(FETCH_PLANS).then(() => {
        this.$store.dispatch(SET_MODAL_DIALOG, {
          component: 'ChooseTariffPlanPopup',
          data: {
            workspaceId: this.workspaceId,
          },
        });
      });
    },
  },
};
</script>

<style>
.blocked-workspace-banner {
  height: auto;
  margin: 15px 0;
  width: 100%;
  padding: 15px;
  color: var(--color-indicator-critical);
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0.16px;
  background: color-mod(var(--color-indicator-critical) alpha(20%));
  border: 1px solid color-mod(var(--color-indicator-critical) alpha(20%));
  border-radius: 6px;

  &__header {
    margin-bottom: 15px;
    font-size: 16px;
  }

  &__button {
    margin-top: 15px;
  }
}
</style>
