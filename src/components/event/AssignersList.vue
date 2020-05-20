<template>
  <div class="event-assigners-list">
    <div class="event-assigners-list__search">
      <Icon
        class="event-assigners-list__search-icon"
        symbol="search"
      />
      <input
        v-model="searchText"
        class="event-assigners-list__search-text"
        :placeholder="'Search'"
        type="text"
      >
    </div>
    <div
      class="event-assigners-list__assigners assigners"
    >
      <div
        v-for="(user, userIndex) in users"
        :key="user.id"
        class="assigners__row"
        @click="toggle(userIndex)"
      >
        <EntityImage
          :id="String(user.id)"
          class="assigners__image"
          :image="user.image"
          :name="user.email || user.name"
          size="16"
        />
        {{ user.email | trim }}
        <Icon
          v-if="user.assigned"
          class="assigners__checkmark"
          symbol="checkmark"
        />
      </div>
    </div>
  </div>
</template>

<script>
import EntityImage from '../utils/EntityImage';
import Icon from '../utils/Icon';

export default {
  name: 'AssignersList',
  components: {
    EntityImage,
    Icon,
  },
  filters: {
    /**
    * Trim a string to a specific length
    *
    * @param {string} name - string for trimming
    */
    trim: function (name) {
      const maxLength = 13;

      if (name.length > maxLength) {
        return `${name.slice(0, maxLength)}...`;
      }

      return name;
    },
  },
  props: {
    /**
     * Workspace id of the current project
     */
    workspaceId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      searchText: '',
      users: [],
    };
  },

  /**
   * Set users from current workspace
   */
  created() {
    const workspaces = this.$store.state.workspaces.list;
    let currentWorkspace = {};

    for (const workspace of workspaces) {
      if (workspace.id == this.workspaceId) {
        currentWorkspace = workspace;

        break;
      }
    }

    const users = currentWorkspace.team.reduce((accumulator, user) => {
      const userData = user.user;

      userData.assigned = false;
      accumulator.push(userData);

      return accumulator;
    }, []);

    this.users = users;
  },
  methods: {
    toggle: function (userIndex) {
      let isAssigned = true;

      if (this.users[userIndex].assigned) {
        isAssigned = false;
      }

      const selectedUser = this.users[userIndex];

      selectedUser.assigned = isAssigned;

      this.$set(this.users, userIndex, selectedUser);
    },
  },
};
</script>

<style>
  @import '../../styles/custom-properties.css';

  .event-assigners-list {
    width: 210px;
    color: var(--color-bg-main);
    background-color: var(--color-text-main);
    border-radius: var(--border-radius);
    box-shadow: 0 11px 13px -4px rgba(0, 0, 0, 0.5);

    &::after {
      position: absolute;
      top: 10px;
      right: 0;
      width: 12px;
      height: 12px;
      background-color: var(--color-text-main);
      transform: rotate(45deg) translateX(8.48px); /* 12 / sqrt(2) */
      content: '';
      pointer-events: none;
    }

    &__search {
      position: relative;
      display: flex;
      align-items: center;
      padding: 10px;
      font-weight: 500;
      color: #575b65;
      font-size: 14px;
      border-bottom: 1px solid #cbd7f2;
    }

    &__search-icon {
      width: 12px;
      height: 12px;
    }

    &__search-text {
      width: calc(100% - 24px);
      border: none;
      background: var(--color-text-second);
      margin-left: 12px;
      font-weight: 500;
      color: #575b65;

      &::placeholder {
        color: var(--color-bg-main);
        opacity: 0.6;
      }
    }
  }

  .assigners {
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    overflow: hidden;
    position: relative;
    max-height: 160px;
    overflow-y: scroll;
    @apply --hide-scrollbar;

    &__image {
      margin-right: 7px;
    }

    &__checkmark {
      position: absolute;
      right: 14px;
      width: 16px;
      height: 16px;
      color: #2ccf6c;
      background-color: #fff;
      border-radius: 50%;
    }

    &__row {
      position: relative;
      display: flex;
      align-items: center;
      padding: 10px;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;

      &:not(:first-child):before {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        width: 177px;
        height: 1px;
        border-top: 1px solid var(--color-bg-main);
        opacity: 0.1;
      }

      &:hover {
        background: #cbd7f2;
        overflow: hidden;

        &::before {
          border-color: #cbd7f2;
          opacity: 1;
          width: 100%;
        }
      }

      &:hover + &:before {
        border-top: 1px solid #cbd7f2;
        width: 100%;
      }
    }
  }
</style>
