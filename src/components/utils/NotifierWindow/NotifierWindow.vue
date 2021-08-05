<template>
  <transition
    v-if="isOpened"
    name="notifier-dialog-animation"
    appear
    @close="close()"
  >
    <div class="notifier-dialog__wrapper">
      <div class="notifier-window__wrapper">
        <span class="notifier-window__title">
          {{ $t("components.newVersionWindow.newVersionMessage") }}
        </span>
        <UiButton
          :submit="true"
          :content="$t('components.newVersionWindow.refresh')"
          class="notifier-window__refresh-button"
          @click="
            () => {
              onRefresh();
              close();
            }
          "
        />
        <UiButton
          secondary
          :content="$t('components.newVersionWindow.whatsNew')"
          class="notifier-window__whatsnew-button"
          @click="
            () => {
              onWhatsNew();
              close();
            }
          "
        />
        <span>
          <Icon
            symbol="close"
            class="notifier-window__close-button"
            @click="
              () => {
                close();
              }
            "
          />
        </span>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import UiButton from './UiButton.vue';
import Icon from './Icon.vue';

export default Vue.extend({
  name: 'NotifierWindow',
  components: {
    UiButton,
    Icon
  },
  data() {
    return {
      /**
       * Is new version window open
       */
      isOpened: false,
    }
  },
  methods: {
    /**
     * Show new version window
     */
    open() {
      this.isOpened = true;
    },
    /**
     * onRefresh callback when user clicks refresh button
     */
    onRefresh: () => {
       window.location.reload();
    },
    /**
     * onWhatsNew callback when user clicks what's new button
     */
    onWhatsNew: () => {
      window.open('docs', '_blank'); // add docs link
    },
    /**
     * Hide new version window
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

.notifier {
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
      /* width: 483px;  uncomment for whats new button */
      padding: 8px 15px;
    }

    &__title {
      font-size: 16px;
      font-weight: normal;
      vertical-align: middle;
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
      display: none; /* Remove for the whats new button */
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
