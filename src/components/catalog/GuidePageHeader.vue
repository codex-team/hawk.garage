<template>
  <div
    class="guide-page-header"
    :style="{background}"
  >
    <router-link
      class="guide-page-header__back-link"
      :to="{name:'add-catcher', params: {projectId: $route.params.projectId}}"
    >
      <Icon
        class="guide-page-header__back-link-icon"
        symbol="arrow-left"
      />
      Back to other catchers
    </router-link>
    <div class="guide-page-header__name-container">
      <div class="guide-page-header__name">
        {{ catcherName }}
      </div>
      <CatalogItemLabel
        class="guide-page-header__label"
        item-type="catcher"
      />
    </div>
    <div class="guide-page-header__description">
      {{ description }}
    </div>
    <div class="guide-page-header__info">
      <div class="guide-page__source-code">
        <a :href="githubLink">View source</a>
      </div>
      <div class="guide-page-header__readme">
        <a :href="readmeLink">View README.md</a>
      </div>
      <div class="guide-page-header__last-version">
        Last version: {{ lastVersion }}
      </div>
    </div>
  </div>
</template>

<script>
import CatalogItemLabel from './ItemLabel';
import Icon from '../utils/Icon';

export default {
  name: 'GuideHeader',
  components: {
    CatalogItemLabel,
    Icon
  },
  props: {
    backgroundImage: {
      type: String,
      required: true
    },
    catcherName: {
      type: String,
      required: true
    },
    githubLink: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    readmeLink: {
      type: String,
      required: true
    },
    lastVersion: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      background: `radial-gradient(circle at 63% 0, rgba(28, 35, 54, 0.72), #15171f), no-repeat center/cover url(${this.backgroundImage})`
    };
  }
};
</script>

<style>
  .guide-page-header {
    display: flex;
    flex-direction: column;
    height: 200px;
    padding: 20px;

    &__back-link {
      display: inline-flex;
      align-items: center;
      opacity: 0.6;

      &:hover {
        opacity: 1;
      }
    }

    &__back-link-icon {
      width: 7px;
      height: 12px;
      margin-right: 8px;
      vertical-align: middle;
    }

    &__name-container {
      display: flex;
      margin-top: 20px;
    }

    &__name {
      font-weight: bold;
      font-size: 43px;
    }

    &__description {
      margin-top: 5px;
      font-size: 15px;
      line-height: 1.2;
    }

    &__info {
      display: flex;
      margin-top: auto;
    }

    &__label {
      margin-top: 10px;
      margin-left: 20px;
    }

    &__source-code,
    &__readme,
    &__last-version {
      height: 20.5px;
      font-weight: 500;
      font-size: 14px;
      line-height: 20.5px;
      white-space: nowrap;
    }

    &__source-code {
      padding-left: 30px;
      background: no-repeat left/ auto 100% url("../../assets/github.svg");
    }

    &__readme {
      margin-left: 20px;
    }

    &__last-version {
      margin-left: auto;
      font-weight: normal;
    }
  }
</style>
