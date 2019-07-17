<template>
  <div class="catalog-item">
    <div
      class="catalog-item__header"
      :style="{'background-image': `url(${image})`}"
    >
      <Badge content="CATCHER" />
    </div>
    <div class="catalog-item__info">
      <div class="catalog-item__name">
        {{ name }}
      </div>
      <div class="catalog-item__description">
        {{ description }}
      </div>
      <button class="button catalog-item__install-button">
        INSTALL
      </button>
    </div>
  </div>
</template>

<script>

import Badge from '../utils/Badge';
export default {
  name: 'CatalogItem',
  components: {
    Badge
  },
  props: {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  }
};
</script>

<style>
.catalog-item {
  max-width: 230px;
  background-color: var(--color-bg-main);
  border-radius: 4px;

  &__header {
    height: 100px;
  }

  &__info {
    padding: 15px;
  }

  &__name {
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 12px;
    letter-spacing: 0.15px;
  }

  &__description {
    font-size: 13px;
    line-height: 1.38;
  }

  &__install-button {
    margin-top: 20px;
    padding: 5px 15px;
    color: var(--color-text-main);
    font-weight: bold;
    font-size: 11px;
    letter-spacing: 0.14px;
    background-color: var(--color-indicator-medium);
    border-radius: 11.5px;
  }
}
</style>
