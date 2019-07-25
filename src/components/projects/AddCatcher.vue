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
      <div class="project-add-catcher__catcher-docs clearfix">
        <div class="project-add-catcher__catcher-docs-text">
          Catcher is a small script that will catch errors in your application and send it to your Hawk page.
        </div>
        <a
          href="#"
          class="project-add-catcher__catcher-docs-link"
        >
          READ MORE
        </a>
      </div>
    </div>
    <div class="project-add-catcher__catalog">
      <div class="project-add-catcher__catalog-container">
        <h2 class="project-add-catcher__catalog-header">
          SELECT CATCHER
        </h2>
        <CatalogItem
          v-for="item in items"
          :key="item.name"
          class="project-add-catcher__catalog-item"
          :name="item.name"
          :image="item.image"
          :description="item.description"
          @click.native="$router.push({name: 'setup-catcher', params: {projectId: $route.params.projectId}})"
        />
      </div>
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
    page: 'php',
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
  @import '../../styles/custom-properties.css';

  .project-add-catcher {
    height: 100%;
    overflow-y: auto;
    @apply --hide-scrollbar;

    &__header {
      padding: 80px 10px 27px 10px;
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
      color: #fff;
      background-color: #09cf5d;
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
      align-items: stretch;
      min-width: 312px;
      max-width: 720px;
      min-height: 68px;
      margin: 40px auto 0 auto;
      padding: 14px 27px 14px 78px;
      font-size: 14px;
      line-height: 1.43;
      background-color: var(--color-bg-second);
      background-image: url("../../assets/instruction.svg");
      background-repeat: no-repeat;
      background-position: 15px 50%;
      background-size: 48px;
      border: solid 1px #1a1d26;
      border-radius: 4px;

      @media (max-width: 1152px) {
        max-width: 475px;
      }

      @media (max-width: 907px) {
        max-width: 230px;
      }
    }

    &__catcher-docs-text,
    &__catcher-docs-link {
      display: flex;
      align-items: center;
    }

    &__catcher-docs-link {
      margin-left:58px;
      color: var(--color-indicator-medium);
      font-weight: 500;
      font-size: 12px;
      letter-spacing: 0.28px;
      white-space: nowrap;
    }

    &__catalog {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__catalog-header {
      position: relative;
      left: 7.5px;
      flex-basis: 100%;
      margin: 33px 0 12.5px 0;
      color: var(--color-text-second);
      font-weight: bold;
      font-size: 12px;
    }

    &__catalog-item {
      margin: 7.5px;
    }

    &__catalog-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      max-width: 735px;
      margin: 0 auto;

      @media (max-width: 1152px) {
        max-width: 490px;
      }

      @media (max-width: 907px) {
        max-width: 245px;
      }
    }
  }
</style>
