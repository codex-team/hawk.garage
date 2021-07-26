<template>
  <transition
    v-if="isOpened"
    name="new-version-dialog-animation"
    appear
    @close="close()"
  >
    <div class="new-version-dialog__wrapper">
      <div class="new-version-window__wrapper">
        <div class="new-version-window__title">
          The new version is available
        </div>
        <UiButton
          :submit="true"
          content="Refresh"
          class="new-version-window__refresh-button"
          @click="
            () => {
              onRefresh();
              close();
            }
          "
        />
        <UiButton
          secondary
          content="What’s new? 😏"
          class="new-version-window__whatsnew-button"
          @click="
            () => {
              onWhatsNew();
              close();
            }
          "
        />
        <Icon
          symbol="close"
          class="new-version-window__close-button"
          @click="
            () => {
              close();
            }
          "
        />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import UiButton from './UiButton.vue';
import Icon from './Icon.vue';
/**
 * @link './README.md'
 */
export default Vue.extend({
  name: 'NewVersionWindow',
  components: {
    UiButton,
    Icon
  },
  data() {
    return {
      /**
       * Is confirmation window open
       */
      isOpened: false,
    }
  },
  methods: {
    /**
     * Show confirmation window
     *
     * @param options - options for displaying
     */
    open() {
      this.isOpened = true;
    },
    /**
   * onRefresh callback when user clicks continue button
   */
    onRefresh: () => {
       window.location.reload();
    },
    /**
     * onWhatsNew callback when user clicks continue button
     */
    onWhatsNew: () => {
      window.open('docs', '_blank');
    },
    /**
     * Hide confirmation window
     */
    close() {
      this.isOpened = false;
    }


  }
});
</script>

<style>
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }

  50% {
    opacity: 1;
    transform: scale(1.05);
  }

  70% {
    transform: scale(0.9);
  }

  100% {
    transform: scale(1);
  }
}

.new-version {
  &-dialog {
    &-animation {
      &-enter-active {
        animation: bounceIn 600ms ease;
      }
    }

    &__wrapper {
      position: fixed;
      right: 30px;
      bottom: 30px;
      z-index: 9995;
      border-radius: 12px;
      background-color: var(--color-bg-second);
      box-shadow: 0 6px 17px -4px rgb(0 0 0 / 61%);
    }
  }
  &-window {
    &__wrapper {
      width: 483px;
      padding: 8px 15px;
    }

    &__title {
      font-size: 16px;
      font-weight: normal;
      display: inline;
      margin: 2px 14px 2px 0;
    }

    &__refresh-button {
      padding: 5px 11px;
      margin-right: 10px;
      border-radius: 13px;
    }
    &__whatsnew-button {
      padding: 5px 11px;
      border-radius: 13px;
      margin-right: 15px;
    }
    &__close-button {
      width: 14px;
      height: 14px;
      vertical-align: middle;
      cursor: pointer;
    }
  }
}
</style>
