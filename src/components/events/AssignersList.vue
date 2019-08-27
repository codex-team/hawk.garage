<template>
  <div class="event-assigners-list">
    <div class="event-assigners-list__row event-assigners-list__row--search">
      <Icon
        class="event-assigners-list__search-icon"
        symbol="search"
      />
      Search
    </div>
    <div
      v-for="user in users"
      :key="user.id"
      class="event-assigners-list__row"
    >
      <EntityImage
        :id="user.id"
        class="event-assigners-list__image"
        :image="user.image"
        :name="user.email || user.name"
      />
      {{ user.email }}
    </div>
  </div>
</template>

<script>
import EntityImage from '../utils/EntityImage';
import Icon from '../utils/Icon'

export default {
  name: 'AssignersList',
  components: {
    EntityImage,
    Icon
  },
  data() {
    return {
      users: [
        {
          id: 1,
          email: 'specc.dev@gmail.com',
          image: 'https://capella.pics/8c91985d-1814-4f87-8835-9c9113c515da.jpg',
          assigned: true
        },
        {
          id: 2,
          email: 'nikmel2803@gmail.com',
          image: 'https://capella.pics/33991d0e-cc53-4a7e-aa81-48a103cd7d09.jpg'
        },
        {
          id: 3,
          email: 'khaydarov@gmail.com',
          image: 'https://capella.pics/a7b08a96-9ac7-424f-b700-48dff2342987.jpg'
        }
      ]
    };
  }
};
</script>

<style>
  .event-assigners-list {
    width: 210px;
    border-radius: var(--border-radius);
    box-shadow: 0 11px 13px -4px rgba(0, 0, 0, 0.5);
    background-color: var(--color-text-main);
    color: var(--color-bg-main);

    &__row {
      display: flex;
      font-size: 14px;
      font-weight: 500;
      padding: 10px;
      align-items: center;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        right: 0;
        bottom: 0;
        opacity: 0.14;
        height: 1px;
        width: 177px;
        border-bottom: 1px solid var(--color-bg-main);
      }

      &--search {
        opacity: 0.6;
      }
    }

    &__image {
      margin-right: 7px;
      width: 16px;
      height: 16px;
    }

    &__search-icon {
      margin-right: 9px;
      width: 12px;
      height: 12px;
    }
  }
</style>
