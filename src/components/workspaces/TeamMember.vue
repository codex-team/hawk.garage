<template>
  <div
    class="team-member"
    :class="{'team-member--pending': member.isPending, 'team-member--admin': hasAdminPermissions}"
  >
    <Icon
      v-if="member.isPending"
      class="team-member__image"
      symbol="user-placeholder"
    />

    <EntityImage
      v-else
      :id="member.id"
      :name="member.email || 'H'"
      :image="member.image"
      class="team-member__image"
    />

    <div class="team-member__name">
      {{ member.name || member.email }}
    </div>
    <div
      v-if="user.id === member.id"
      class="team-member__you-label"
    >
      ({{ $t('workspaces.settings.team.youLabel') }})
    </div>

    <div
      v-if="member.isAdmin || member.isPending"
      class="team-member__status-label"
      :class="{'team-member__status-label--admin': member.isAdmin}"
    >
      {{ member.isAdmin ? $t('workspaces.settings.team.adminLabel') : $t('workspaces.settings.team.invitationSentLabel') }}
    </div>

    <TooltipMenu
      v-if="hasAdminPermissions && user.id !== member.id"
      class="team-member__tooltip-menu"
      :options="getTooltipMenuOptions(member)"
    />
  </div>
</template>

<script>
import EntityImage from '../utils/EntityImage';
import Icon from '../utils/Icon';
import TooltipMenu from '../utils/TooltipMenu';
import { GRANT_ADMIN_PERMISSIONS, REMOVE_USER_FROM_WORKSPACE } from '../../store/modules/workspaces/actionTypes';

export default {
  name: 'TeamMember',
  components: {
    TooltipMenu,
    EntityImage,
    Icon
  },
  props: {
    workspaceId: {
      type: String,
      required: true
    },
    member: {
      type: Object,
      required: true
    },
    hasAdminPermissions: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      user: this.$store.state.user.data
    };
  },
  methods: {
    getTooltipMenuOptions(member) {
      const options = [];

      if (!member.isPending) {
        options.push({
          title: member.isAdmin ? this.$t('workspaces.settings.team.withdrawPermissions') : this.$t('workspaces.settings.team.grantAdmin'),
          onClick: this.grantAdmin(member.id, member.isAdmin)
        });
      }

      options.push({
        title: this.$t('workspaces.settings.team.removeMember'),
        onClick: this.removeUser(member.id, member.email)
      });

      return options;
    },
    grantAdmin(userId, previousState) {
      return () => this.$store.dispatch(GRANT_ADMIN_PERMISSIONS, {
        workspaceId: this.workspaceId,
        userId,
        state: !previousState
      });
    },
    removeUser(userId, userEmail) {
      return () => this.$store.dispatch(REMOVE_USER_FROM_WORKSPACE, {
        workspaceId: this.workspaceId,
        userId,
        userEmail
      });
    }
  }
};
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
