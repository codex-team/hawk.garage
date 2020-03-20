<template>
  <div
    class="team-member"
    :class="{'team-member--pending': member.isPending, 'team-member--admin': isTooltipShowed}"
  >
    <Icon
      v-if="member.isPending"
      class="team-member__image"
      symbol="user-placeholder"
    />

    <EntityImage
      v-else
      :id="member.user.id"
      :name="member.user.email || 'H'"
      :image="member.user.image"
      class="team-member__image"
    />

    <div class="team-member__name">
      {{ member.user.name || member.user.email }}
    </div>
    <div
      v-if="user.id === member.user.id"
      class="team-member__you-label"
    >
      ({{ $t('workspaces.settings.team.youLabel') }})
    </div>

    <div
      v-if="member.isAdmin || isPending"
      class="team-member__status-label"
      :class="{'team-member__status-label--admin': member.isAdmin}"
    >
      {{ member.isAdmin ? $t('workspaces.settings.team.adminLabel') : $t('workspaces.settings.team.invitationSentLabel') }}
    </div>

    <TooltipMenu
      v-if="isTooltipShowed && user.id !== member.user.id"
      class="team-member__tooltip-menu"
      :options="getTooltipMenuOptions()"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import EntityImage from '../../utils/EntityImage.vue';
import Icon from '../../utils/Icon.vue';
import TooltipMenu from '../../utils/TooltipMenu.vue';
import { GRANT_ADMIN_PERMISSIONS, REMOVE_USER_FROM_WORKSPACE } from '@/store/modules/workspaces/actionTypes';
// eslint-disable-next-line no-unused-vars
import { isPendingMember, Member } from '@/types/workspaces';
// eslint-disable-next-line no-unused-vars
import { TooltipMenuOptions } from '@/components/utils/tooltipMenu';

export default Vue.extend({
  name: 'TeamMember',
  components: {
    TooltipMenu,
    EntityImage,
    Icon,
  },
  props: {
    /**
     * Member's workspace id
     */
    workspaceId: {
      type: String,
      required: true,
    },

    /**
     * Workspace member to display
     */
    member: {
      type: Object as () => Member,
      required: true,
    },

    /**
     * If true tooltip menu will be visible
     */
    isTooltipShowed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      user: this.$store.state.user.data,
    };
  },
  computed: {
    isPending(): boolean {
      return isPendingMember(this.member);
    },
  },
  methods: {
    /**
     * Returns options for tooltip menu
     */
    getTooltipMenuOptions(): TooltipMenuOptions[] {
      const options: TooltipMenuOptions[] = [];

      if (!isPendingMember(this.member)) {
        options.push({
          title: (this.member.isAdmin
            ? this.$t('workspaces.settings.team.withdrawPermissions') : this.$t('workspaces.settings.team.grantAdmin')) as string,
          onClick: this.grantAdmin,
        });
      }
      options.push({
        title: this.$t('workspaces.settings.team.removeMember') as string,
        onClick: this.removeUser,
      });

      return options;
    },

    /**
     * Grant or withdraw admin permissions
     */
    async grantAdmin(): Promise<void> {
      if (!isPendingMember(this.member)) {
        await this.$store.dispatch(GRANT_ADMIN_PERMISSIONS, {
          workspaceId: this.workspaceId,
          userId: this.member.user.id,
          state: !this.member.isAdmin,
        });
      }
    },

    /**
     * Removes user from workspace
     */
    async removeUser(): Promise<void> {
      if (isPendingMember(this.member)) {
        await this.$store.dispatch(REMOVE_USER_FROM_WORKSPACE, {
          workspaceId: this.workspaceId,
          userId: null,
          userEmail: this.member.email,
        });
      } else {
        await this.$store.dispatch(REMOVE_USER_FROM_WORKSPACE, {
          workspaceId: this.workspaceId,
          userId: this.member.user.id,
          userEmail: null,
        });
      }
    },
  },
});
</script>

<style>
  .team-member {
    display: flex;
    align-items: center;
    width: 600px;
    height: 46px;
    color: var(--color-text-main);
    font-size: 13px;
    letter-spacing: 0.16px;
    border-bottom: 1px solid rgba(219, 230, 255, 0.1);

    &--pending {
      ^&__name {
        color: var(--color-text-second);
      }
    }

    &--admin {
      ^&__status-label {
        margin-right: 15px;

        &:last-child {
          margin-right: 28px;
        }
      }

      &:only-child {
        ^&__status-label {
          margin-right: 0;
        }
      }
    }

    &__image {
      width: 16px;
      height: 16px;
      font-size: 11px;
      line-height: 17px;
      border-radius: 5px;
      flex-shrink: 0;
    }

    &__name {
      margin-left: 10px;
    }

    &__you-label {
      margin-left: 5px;
      color: var(--color-text-second);
    }

    &__status-label {
      margin-right: 0;
      margin-left: auto;
      color: var(--color-text-second);
      user-select: none;
      white-space: nowrap;

      &--admin {
        color: #2ccf6c;
      }

      & + ^&__tooltip-menu {
        margin-left: 0;
      }
    }

    &__tooltip-menu {
      margin-left: auto;
    }
  }
</style>
