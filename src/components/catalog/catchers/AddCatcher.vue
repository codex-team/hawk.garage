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
            {{ $t('components.catalog.step1') }}
          </div>
        </div>
        <div class="project-add-catcher__steps-bind" />
        <div class="project-add-catcher__step">
          2
          <div class="project-add-catcher__step-caption">
            {{ $t('components.catalog.step2') }}
          </div>
        </div>
      </div>
      <div class="project-add-catcher__info">
        {{ $t('components.catalog.whatToDo') }}
      </div>
      <div class="project-add-catcher__catcher-docs clearfix">
        <div class="project-add-catcher__catcher-docs-text">
          {{ $t('components.catalog.whatIsCatcher') }}
        </div>
        <a
          href="https://docs.hawk.so/catchers"
          class="project-add-catcher__catcher-docs-link"
          target="_blank"
        >
          {{ $t('common.readMore') }}
        </a>
      </div>
    </div>
    <div class="project-add-catcher__catalog">
      <div class="project-add-catcher__catalog-container">
        <h2 class="project-add-catcher__catalog-header">
          {{ $t('components.catalog.selectCatcherHeading') }}
        </h2>
        <CatalogItem
          v-for="item in items"
          :key="item.name"
          type="catcher"
          class="project-add-catcher__catalog-item"
          :name="item.name"
          :image="item.image"
          :description="item.description"
          :class="{'project-add-catcher__catalog-item--not-implemented': !item.page}"
          @click.native="item.page && $router.push({name: 'setup-catcher', params: {projectId: $route.params.projectId, page: item.page}})"
        />

        <a class="project-add-catcher__catalog-more" href="https://docs.hawk.so/integrations?from=garage" target="_blank">
          {{ $t('components.catalog.discoverMore') }}
        </a>

        <h2 class="project-add-catcher__catalog-header">
          {{ $t('components.catalog.migrationFromSentry') }}
        </h2>
        <CatalogItem
          type="external"
          class="project-add-catcher__catalog-item"
          :name="'SENTRY'"
          :isWide="true"
          :image="require('../../../assets/catalog/sentry.svg')"
          :description="$t('components.catalog.migrationFromSentryDescription')"
          @click.native="$router.push({name: 'setup-catcher', params: {projectId: $route.params.projectId, page: 'sentry'}})"
        />
        <div class="project-add-catcher__migration-description"></div>
      </div>

    </div>
  </div>
</template>

<script>
import Icon from '../../utils/Icon';
import CatalogItem from '../Item';


export default {
  name: 'ProjectAddCatcher',
  components: {
    Icon,
    CatalogItem,
  },
  data() {
    return {
      items: [
        {
          name: 'JAVASCRIPT',
          page: 'javascript',
          description: this.$t('components.catalog.catchers.js'),
          image: require('../../../assets/catalog/javascript/js@3x.jpg'),
        },
        {
          name: 'PHP',
          page: 'php',
          description: this.$t('components.catalog.catchers.php'),
          image: require('../../../assets/catalog/php.svg'),
        },
        {
          name: 'NODE.JS',
          page: 'nodejs',
          description: this.$t('components.catalog.catchers.nodejs'),
          image: require('../../../assets/catalog/nodejs.svg'),
        },
        {
          name: 'PYTHON',
          page: 'python',
          description: this.$t('components.catalog.catchers.python'),
          image: require('../../../assets/catalog/python.svg'),
        },
        {
          name: 'GO',
          page: 'go',
          description: this.$t('components.catalog.catchers.go'),
          image: require('../../../assets/catalog/go/go@3x.jpg'),
        },
        {
          name: 'KOTLIN',
          page: 'kotlin',
          description: this.$t('components.catalog.catchers.kotlin'),
          image: require('../../../assets/catalog/kotlin/kotlin@3x.jpg'),
        },
        // {
        //   name: 'SCALA',
        //   description: this.$t('components.catalog.catchers.scala'),
        //   image: require('../../../assets/catalog/scala/scala@3x.jpg'),
        // },
      ],
    };
  },
};
</script>

<style>
  @import '../../../styles/custom-properties.css';

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
      text-transform: uppercase;
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
      background-image: url("../../../assets/instruction.svg");
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
      text-transform: uppercase;
    }

    &__catalog {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-bottom: 100px;
    }

    &__catalog-header {
      position: relative;
      left: 7.5px;
      flex-basis: 100%;
      margin: 33px 0 12.5px 0;
      @apply --ui-label;
    }

    &__catalog-item {
      flex-grow: 1;
      margin: 7.5px;

      &--not-implemented {
        opacity: 0.3;
      }

      &:not(&--not-implemented)&:hover {
        box-shadow: 0 2px 12px -5px rgba(0,0,0,0.65);
        transform: translateY(-2px);
      }

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

    &__catalog-more {
      background-color: var(--color-bg-main);
      margin: 7.5px 7.5px 50px;
      text-align: center;
      padding: 18px 20px;
      border-radius: 4px;
      width: 100%;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        box-shadow: 0 6px 12px -5px rgba(0,0,0,0.15);
        transform: translateY(-2px);
      }
    }
  }
</style>
