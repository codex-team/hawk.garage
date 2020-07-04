<template>
  <div class="event-assignees-list">
    <div class="event-assignees-list__search">
      <Icon
        class="event-assignees-list__search-icon"
        symbol="search"
      />
      <input
        v-model="searchText"
        class="event-assignees-list__search-text"
        :placeholder="'Search'"
        type="text"
      >
    </div>
    <div
      class="event-assignees-list__assignees assignees"
    >
      <div
        v-for="(user, userIndex) in users"
        :key="user.id"
        class="assignees__row"
        @click="toggle(userIndex)"
      >
        <EntityImage
          :id="String(user.id)"
          class="assignees__image"
          :image="user.image"
          :name="user.email || user.name"
          size="16"
        />
        <div class="assignees__name-wrapper name-wrapper">
          <span class="name-wrapper__name name-wrapper__name--scrollable">
            {{ user.email }}
          </span>
        </div>
        <Icon
          v-if="user.id == currentAssigneeId"
          class="assignees__checkmark"
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
  name: 'AssigneesList',
  components: {
    EntityImage,
    Icon,
  },
  props: {
    /**
     * Workspace id of the current project
     */
    workspaceId: {
      type: String,
      default: '',
    },
    /**
     * id of the selected event
     */
    eventId: {
      type: String,
      default: '',
    },
    /**
     * id of current project
     */
    projectId: {
      type: String,
      default: '',
    },
    eventGroupHash: {
      type: String,
      default: ''
    }
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
    const workspace = this.$store.getters.getWorkspaceById(this.workspaceId);

    // Takes all users who are part of the project team
    const users = workspace.team.reduce((accumulator, user) => {
      const userData = user.user;

      userData.assigned = false;
      accumulator.push(userData);

      return accumulator;
    }, []);

    this.users = users;
  },
  computed: {
    /**
     * Return assignee id 
     */
    currentAssigneeId: function() {
      const currentEvent = this.$store.getters.getEventByProjectIdAndGroupHash(this.projectId, this.eventGroupHash);
      const assignee = currentEvent.assignee;

      return assignee;
    }
  },
  methods: {
    toggle: function (userIndex) {
      if (this.assigneeId == this.users[userIndex].id) {
        this.$store.dispatch('UPDATE_EVENT_ASSIGNEE', {
          projectId: this.projectId,
          eventId: this.eventId,
          assignee: '',
        });

        this.assigneeId = '';
      } else {
        this.$store.dispatch('UPDATE_EVENT_ASSIGNEE', {
          projectId: this.projectId,
          eventId: this.eventId,
          assignee: this.users[userIndex].id,
        });
      }
    }
  },
};
</script>

<style>
  @import '../../styles/custom-properties.css';

  .event-assignees-list {
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

  .assignees {
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
      top: 50%;
      transform: translateY(-50%);
      right: 14px;
      width: 16px;
      height: 16px;
      color: #2ccf6c;
      background-color: #fff;
      border-radius: 50%;
      user-select: none;
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

      &:hover &:before {
        border-top: 1px solid #cbd7f2;
        width: 100%;
      }
    }
  }

  .name-wrapper {
    margin-right: 30px;
    white-space: nowrap;
    overflow: hidden;

    &__name--scrollable {
      display: block;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
</style>
