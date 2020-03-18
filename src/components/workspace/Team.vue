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
          type="button"
          class="workspace-team__copy-button"
          :value="$t('components.codeBlock.copy')"
        >
      </div>
    </div>

    <div class="workspace-team__section">
      <label
        v-if="currentMembership.isAdmin"
        class="label"
      >{{ $t('workspaces.settings.team.title') }}</label>
      <div>
        <TeamMember
          v-for="member in (workspace.users ? workspace.users.concat(workspace.pendingUsers) : [])"
          :key="member.id"
          :has-admin-permissions="currentMembership.isAdmin"
          :workspace-id="workspace.id"
          :member="member"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import notifier from 'codex-notifier';
import { INVITE_TO_WORKSPACE } from '@/store/modules/workspaces/actionTypes';
import TeamMember from './TeamMember.vue';
import { Workspace, Member } from '@/types/workspaces';

export default Vue.extend({
  name: 'WorkspaceSettingsTeam',
  components: { TeamMember },
  props: {
    /**
     * Workspace which settings we are viewing
     * Passed from <SettingsLayout>
     */
    workspace: {
      type: Object as () => Workspace,
      required: true,
    },
  },
  data() {
    return {
      userEmail: '',
      baseUrl: window.location.origin,
      user: this.$store.state.user.data,
    };
  },
  computed: {
    /**
     * Current workspace team: users + pending users
     */
    team(): Member[] {
      if (!this.workspace) {
        return [];
      }

      return [...this.workspace.users, ...this.workspace.pendingUsers];
    },

    /**
     * Current user in current workspace
     */
    currentMembership(): Member | undefined {
      return this.team.find(u => u.userId === this.user.id);
    },
  },
  methods: {
    onLinkCopied() {
      notifier.show({
        message: this.$t('common.copiedNotification') as string,
        style: 'success',
        time: 2000,
      });
    },
    async onInvitationSent() {
      if (!this.userEmail) {
        return;
      }

      try {
        await this.$store.dispatch(
          INVITE_TO_WORKSPACE,
          {
            userEmail: this.userEmail,
            workspaceId: this.$route.params.workspaceId,
          }
        );

        notifier.show({
          message: this.$t('workspaces.settings.team.sentNotification') as string,
          style: 'success',
          time: 10000,
        });

        this.userEmail = '';
      } catch (e) {
        notifier.show({
          message: e.message,
          style: 'error',
          time: 10000,
        });
      }
    },
  },
});

</script>

<style src="../../styles/settings-window-page.css"></style>

<style>
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
