<template>
  <div class="project-add-catcher">
    <div class="project-add-catcher__header">
      <div class="project-add-catcher__steps">
        <div class="project-add-catcher__step">
          1
          <Icon
            class="project-add-catcher__tick-icon"
            symbol="tick"
          />
          <div class="project-add-catcher__step-caption">
            ADD A PROJECT
          </div>
        </div>
        <div class="project-add-catcher__steps-bind" />
        <div class="project-add-catcher__step">
          2
          <div class="project-add-catcher__step-caption">
            INSTALL A CATCHER
          </div>
        </div>
      </div>
      <div class="project-add-catcher__info">
        To start track events, you need to connect one of our Catchers
      </div>
      <div class="project-add-catcher__catcher-docs">
        Catcher is a small script that will catch errors in your application and send it to your Hawk page.
        <a
          href="#"
          class="project-add-catcher__catcher-docs-link"
        >
          READ MORE
        </a>
      </div>
    </div>
    <div class="project-add-catcher__catcher-catalog">
      <h2 class="project-add-catcher__catcher-catalog-header">
        SELECT CATCHER
      </h2>
      <CatalogItem
        v-for="item in items"
        :key="item.name"
        :name="item.name"
        :image="item.image"
        :description="item.description"
      />
    </div>
  </div>
</template>

<script>
import Icon from '../utils/Icon';
import CatalogItem from './CatalogItem';

const catalogItems = [
  {
    name: 'NODE.JS',
    description: 'Track errors from your backend application written on JavaScript',
    image: require('../../assets/catalog/nodejs.svg')
  },
  {
    name: 'PHP',
    description: 'Can be connected as standalone script or as monolog provider',
    image: require('../../assets/catalog/php.svg')
  },
  {
    name: 'PYTHON',
    description: 'Small, simple and full-featured catcher',
    image: require('../../assets/catalog/python.svg')
  },
  {
    name: 'JAVASCRIPT',
    description: 'Advanced client catcher with errors bunching',
    image: require('../../assets/catalog/javascript/js@3x.jpg')
  },
  {
    name: 'GO',
    description: 'Deadly simple and fast errors tracking',
    image: require('../../assets/catalog/go/go@3x.jpg')
  },
  {
    name: 'SCALA',
    description: 'Boost your scala application quality',
    image: require('../../assets/catalog/scala/scala@3x.jpg')
  }
];

export default {
  name: 'ProjectAddCatcher',
  components: {
    Icon,
    CatalogItem
  },
  data() {
    return {
      items: catalogItems
    };
  }
};
</script>

<style>
  .project-add-catcher {
    overflow-y: auto;
    height: 100%;
    &__header {
      padding-top: 80px;
      padding-bottom: 27px;
      background-image: radial-gradient(circle at 52% 3%, #313748, var(--color-bg-main));
    }

    &__steps {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__step {
      position: relative;
      width: 35px;
      height: 35px;
      font-weight: bold;
      line-height: 32px;
      text-align: center;
      border: 2px solid var(--color-text-second);
      border-radius: 50%;

      &:first-child {
        color: var(--color-text-second);
        border: 2px solid var(--color-text-second);
      }

      &:last-child {
        border: 2px solid var(--color-text-main);
      }
    }

    &__steps-bind {
      width: 153px;
      height: 1px;
      margin: 0 26px;
      border-style: solid;
      border-width: 1px;
      border-image-source: linear-gradient(to right, #939baf, var(--color-text-main));
      border-image-slice: 1;
    }

    &__tick-icon {
      position: absolute;
      right: -17px;
      bottom: -4px;
      width: 28px;
      height: 28px;
      padding: 6px;
      color: var(--color-text-main);
      background-color: #2ccf6c;
      border-radius: 100%;
    }

    &__step-caption {
      position: absolute;
      bottom: -24px;
      left: 50%;
      font-weight: bold;
      font-size: 12px;
      line-height: 12px;
      white-space: nowrap;
      transform: translateX(-50%);
    }

    &__info {
      margin-top: 68px;
      text-align: center;
    }

    &__catcher-docs {
      display: flex;
      min-height: 68px;
      margin: 40px 115px 0;
      padding: 14px 27px 14px 78px;
      background-color: var(--color-bg-second);
      background-image: url("../../assets/instruction.svg");
      background-repeat: no-repeat;
      background-position: 15px 50%;
      background-size: 48px;
      border: solid 1px #1a1d26;
      border-radius: 5px;
    }

    &__catcher-docs-link {
      display: block;
      margin: auto 0 auto 26px;
      color: var(--color-indicator-medium);
      font-weight: 500;
      font-size: 12px;
      letter-spacing: 0.28px;
      white-space: nowrap;
    }

    &__catcher-catalog {
      padding: 33px 100px;
    }

    &__catcher-catalog-header {
      margin-bottom: 110px;
      color: var(--color-text-second);
      font-weight: bold;
      font-size: 12px;
    }
  }
</style>
