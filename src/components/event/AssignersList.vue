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
        v-for="user in users"
        :key="user.id"
        class="assigners__row"
      >
        <EntityImage
          :id="String(user.id)"
          class="assigners__image"
          :image="user.image"
          :name="user.email || user.name"
          size="16"
        />
        {{ user.email | strip }}
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
    strip: function (name) {
      if (name.length > 13) {
        return `${name.slice(0, 13)}...`;
      }

      return name;
    },
  },
  data() {
    return {
      users: [
        {
          id: 1,
          email: 'specc.dev@gmail.com',
          image: 'https://capella.pics/8f0dfd0a-e8e6-4010-a426-d2cdc5901f8a.jpg',
          assigned: true,
        },
        {
          id: 2,
          email: 'nikmel2803@gmail.com',
          image: 'https://capella.pics/8f0dfd0a-e8e6-4010-a426-d2cdc5901f8a.jpg',
        },
        {
          id: 3,
          email: 'Somebody once told me',
          image: 'https://capella.pics/8f0dfd0a-e8e6-4010-a426-d2cdc5901f8a.jpg',
        },
        {
          id: 4,
          email: 'geekan@bk.ru',
          image: 'https://capella.pics/8f0dfd0a-e8e6-4010-a426-d2cdc5901f8a.jpg',
        },
        {
          id: 5,
          email: 'geekan@bk.ru',
          image: 'https://capella.pics/8f0dfd0a-e8e6-4010-a426-d2cdc5901f8a.jpg',
        },
      ],
      searchText: '',
    };
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
