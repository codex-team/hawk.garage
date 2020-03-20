<template>
  <div class="viewed-by">
    <Icon symbol="eye" />
    <div
      v-for="user in shownUsers"
      class="viewed-by__user"
      :title="user"
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
import Icon from './Icon.vue';

export default Vue.extend({
  name: 'ViewedBy',
  components: {
    Icon,
  },
  props: {
    /**
     * Users that have visited the object
     */
    users: {
      type: Array as () => string[],
      required: true,
    },
  },
  computed: {
    /**
     * We can show only 3 last users
     */
    shownUsers(): string[] {
      return this.users.slice(0, 3);
    },

    /**
     * We can show only 3 last users, other will be hided.
     * This method returns the hidded users.
     */
    hiddenUsers(): string[] {
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
      width: 14px;
      height: 14px;
      margin-right: 6px;
      background-color: var(--color-bg-second);
      border-radius: 5px;
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
