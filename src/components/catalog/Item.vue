<template>
  <div class="catalog-item">
    <div
      class="catalog-item__header"
      :style="{'background-image': `url(${image})`}"
    >
      <CatalogItemLabel
        class="catalog-item__type"
        :item-type="type"
      />
    </div>
    <div class="catalog-item__info">
      <div class="catalog-item__name">
        {{ name }}
      </div>
      <div class="catalog-item__description">
        {{ description }}
      </div>
    </div>
    <button class="button button--small button--rounded catalog-item__install-button">
      INSTALL
    </button>
  </div>
</template>

<script>
import CatalogItemLabel from './ItemLabel';

export default {
  name: 'CatalogItem',
  components: {
    CatalogItemLabel
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
    },
    type: {
      type: String,
      required: true
    }
  }
};
</script>

<style>
.catalog-item {
  display: flex;
  flex-direction: column;
  max-width: 230px;
  height: 230px;
  background-color: var(--color-bg-main);
  border-radius: 4px;
  cursor: pointer;
  transition: all 120ms ease;

  &:hover {
    box-shadow: 0 2px 12px -5px rgba(0,0,0,0.65);
    transform: translateY(-2px);
  }

  &__header {
    height: 100px;
    background-position: center center;
    background-size: cover;
    border-radius: 4px;
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
    margin: 15px;
  }

  &__type {
    margin: 12px 0 0 13px;
  }
}
</style>
