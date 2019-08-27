<template>
  <div
    class="team-member"
    :class="{'team-member--pending': member.isPending}"
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

    <div class="team-member__dots-container">
      <!-- @todo add popup -->
      <div class="team-member__dots" />
    </div>
  </div>
</template>

<script>
import EntityImage from '../utils/EntityImage';
import Icon from '../utils/Icon';

export default {
  name: 'TeamMember',
  components: { EntityImage, Icon },
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      user: this.$store.state.user.data
    };
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
      margin-right: 15px;
      margin-left: auto;
      color: var(--color-text-second);

      &--admin {
        color: #2ccf6c;
      }

      & + ^&__dots-container {
        margin-left: 0;
      }
    }

    &__dots-container {
      margin-left: auto;
      padding: 6px 3px;
      cursor: pointer;
    }

    &__dots {
      position: relative;
      width: 3px;
      height: 3px;
      background-color: rgba(219, 230, 255, 0.6);

      &::before, &::after {
        position: absolute;
        width: 3px;
        height: 3px;
        background-color: rgba(219, 230, 255, 0.6);
        content: '';
      }

      &::before {
        top: -6px;
      }

      &::after {
        top: 6px;
      }
    }
  }
</style>
