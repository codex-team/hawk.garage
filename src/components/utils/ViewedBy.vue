<template>
  <div
    v-if="users.length > 0"
    class="viewed-by"
  >
    <Icon symbol="eye" />
    <EntityImage
      v-for="user in shownUsers"
      :id="user.id"
      :key="user.id"
      :title="user.name || user.email"
      class="viewed-by__user"
      :name="user.name || user.email"
      :image="user.image"
      size="14"
    />
    <span
      v-if="hiddenUsers.length"
      class="viewed-by__count"
    >
      +{{ hiddenUsers.length }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import EntityImage from './EntityImage.vue';
import Icon from './Icon.vue';
import { User } from '@/types/user';

export default Vue.extend({
  name: 'ViewedBy',
  components: {
    EntityImage,
    Icon,
  },
  props: {
    /**
     * Users that have visited the object
     */
    users: {
      type: Array as () => User[],
      required: true,
    },
  },
  computed: {
    /**
     * We can show only 3 last users
     */
    shownUsers(): User[] {
      return this.users.slice(0, 3);
    },

    /**
     * We can show only 3 last users, other will be hided.
     * This method returns the hidden users.
     */
    hiddenUsers(): User[] {
      return this.users.slice(3);
    },
  },
});
</script>

<style>
  .viewed-by {
    display: flex;
    align-items: center;
    color: var(--color-text-second);

    &__user {
      margin-right: 6px;
    }

    &__count {
      font-size: 12px;
    }
    .icon {
      width: 12px;
      height: 8px;
      margin-right: 6px;
    }
  }
</style>
