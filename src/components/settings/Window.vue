<template>
  <PopupWindow @close="onCloseRoute ? $router.push(onCloseRoute) : $router.go(-1)">
    <div class="settings-window">
      <div class="settings-window__menu">
        <slot name="header" />
        <slot name="menu" />
      </div>
      <div class="settings-window__content">
        <router-view />
      </div>
    </div>
  </PopupWindow>
</template>

<script>
import PopupWindow from '../utils/PopupWindow';

export default {
  name: 'SettingsWindow',
  components: {
    PopupWindow
  },
  props: {
    onCloseRoute: {
      type: [Object, String],
      default: null
    }
  }
};
</script>

<style>
  @import '../../styles/custom-properties.css';

  .settings-window {
    display: flex;
    height: 100%;
    background-color: var(--color-bg-second);

    &__menu {
      width: 418px;
      padding-top: 30px;
      padding-right: 26px;
      padding-left: 192px;
      background-color: var(--color-bg-main);
    }

    &__header {
      margin-bottom: 30px;

      @apply --clearfix;
    }

    &__logo {
      float: left;
      width: 42px;
      height: 42px;
      margin-right: 20px;
    }

    &__menu-item {
      display: block;
      width: 220px;
      height: 34px;
      margin: 3px -10px;
      padding-left: 10px;
      font-weight: 500;
      line-height: 34px;
      border-radius: 3px;
      cursor: pointer;
      user-select: none;

      &:hover, &.router-link-exact-active {
        background-color: var(--color-bg-second);
      }

      &--attention {
        color: var(--color-indicator-critical)
      }
    }

    &__content {
      @apply --hide-scrollbar;
      width: 100%;
      margin: 50px 200px 50px 50px;
      overflow: auto;
    }
  }
</style>
