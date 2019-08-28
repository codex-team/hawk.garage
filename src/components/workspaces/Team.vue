<template>
  <div class="settings-window-page workspace-team">
    <div class="settings-window-page__title">
      {{ $t('workspaces.settings.team.title') }}
    </div>

    <div
      v-if="currentMembership.isAdmin"
      class="workspace-team__section"
    >
      <label class="label">{{ $t('workspaces.settings.team.inviteByEmailLabel') }}</label>
      <form @submit.prevent="onInvitationSent">
        <input
          v-model="userEmail"
          type="email"
          class="input workspace-team__input"
        >
        <input
          type="submit"
          class="button button--submit"
          :value="$t('workspaces.settings.team.sendButton')"
        >
      </form>
    </div>

    <div
      v-if="currentMembership.isAdmin"
      class="workspace-team__section"
    >
      <label class="label">{{ $t('workspaces.settings.team.inviteByLinkLabel') }}</label>
      <div
        v-copyable="{selector: 'span', callback: onLinkCopied}"
        class="input workspace-team__invite-link-container clearfix"
      >
        <span>{{ `${baseUrl}/join/${workspace.id}` }}</span>
        <input
          type="submit"
          class="workspace-team__copy-button"
          :value="$t('workspaces.settings.team.copyButton')"
        >
      </div>
    </div>

    <div class="workspace-team__section">
      <label
        v-if="currentMembership.isAdmin"
        class="label"
      >{{ $t('workspaces.settings.team.title') }}</label>
      <TeamMember
        v-for="member in workspace.users"
        :key="member.id"
        :has-admin-permissions="currentMembership.isAdmin"
        :workspace-id="workspace.id"
        :member="member"
      />
      <TeamMember
        v-for="member in workspace.pendingUsers"
        :key="member.email"
        :has-admin-permissions="currentMembership.isAdmin"
        :workspace-id="workspace.id"
        :member="member"
      />
    </div>
  </div>
</template>

<script>
import notifier from 'codex-notifier';
import { INVITE_TO_WORKSPACE } from '../../store/modules/workspaces/actionTypes';
import TeamMember from './TeamMember';

export default {
  name: 'WorkspaceTeam',
  components: { TeamMember },
  data() {
    return {
      userEmail: '',
      baseUrl: window.location.origin,
      user: this.$store.state.user.data
    };
  },
  computed: {
    workspace() {
      const workspaceId = this.$route.params.workspaceId;

      return this.$store.getters.getWorkspaceById(workspaceId);
    },
    currentMembership() {
      const workspaceId = this.$route.params.workspaceId;

      const { users } = this.$store.getters.getWorkspaceById(workspaceId);

      return users ? users.find(u => u.id === this.user.id) : {};
    }
  },
  methods: {
    onLinkCopied() {
      notifier.show({
        message: this.$t('workspaces.settings.team.copiedNotification'),
        style: 'success',
        time: 10000
      });
    },
    async onInvitationSent() {
      if (!this.userEmail) return;

      try {
        await this.$store.dispatch(
          INVITE_TO_WORKSPACE,
          { userEmail: this.userEmail, workspaceId: this.$route.params.workspaceId }
        );

        notifier.show({
          message: this.$t('workspaces.settings.team.sentNotification'),
          style: 'success',
          time: 10000
        });

        this.userEmail = '';
      } catch (e) {
        notifier.show({
          message: e.message,
          style: 'error',
          time: 10000
        });
      }
    }
  }
};
</script>

<style>
  @import "../../styles/settings-window-page.css";

  .workspace-team {
    &__section {
      margin-bottom: 30px;
    }

    &__input {
      width: 300px;
      margin-top: 10px;
      margin-right: 15px;
    }

    &__invite-link-container {
      width: 600px;
      margin-top: 10px;
      color: var(--color-text-highlighted);
      line-height: 23px;
      cursor: pointer;
    }

    &__copy-button {
      float: right;
      min-width: 60px;
      height: 23px;
      color: var(--color-text-main);
      font-size: 11px;
      line-height: 23px;
      letter-spacing: 0.14px;
      background-color: var(--color-indicator-medium);
      border: 0;
      border-radius: 11.5px;
      outline: none;
      cursor: pointer;

      &:hover {
        background-color: var(--color-indicator-medium-dark);
      }
    }
  }
</style>
