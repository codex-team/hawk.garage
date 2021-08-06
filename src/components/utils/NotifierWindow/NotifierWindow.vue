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
          {{ description }}
        </span>
        <UiButton
          v-for="button in notifierButtons"
          :key="button.text"
          :submit="button.type === sumbitButton"
          :secondary="button.type === secondaryButton"
          :warning="button.type === warningButton"
          :content="button.text"
          class="notifier-window__button"
          @click="
            () => {
              button.onClick();
              close();
            }
          "
        />
        <span
          @click="
            () => {
              close();
            }
          "
        >
          <Icon
            symbol="close"
            class="notifier-window__close-button"
          />
        </span>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import UiButton from '../UiButton.vue';
import Icon from '../Icon.vue';
import { NotifierButtonType, NotifierButton, NotifierWindowOptions } from './types';

export default Vue.extend({
  name: 'NotifierWindow',
  components: {
    UiButton,
    Icon
  },
  data() {
    return {
      /**
       * Is notifier window open
       */
      isOpened: false,

      /**
       * Description of notification action
       */
      description: '',

      /**
       * Button type submit const
       */
      sumbitButton: NotifierButtonType.SUBMIT,

      /**
       * Button type warning const
       */
      warningButton: NotifierButtonType.WARNING,
      
      /**
       * Button type secondary const
       */
      secondaryButton: NotifierButtonType.SECONDARY,
      
      /**
       * Notifier window buttons
       */
      notifierButtons: [] as NotifierButton[]
    }
  },
  methods: {
    /**
     * Show notifier open window
     * 
     * @param options - options for displaying
     */
    open(options?: NotifierWindowOptions) {
      this.description = options && options.description || '';
      this.notifierButtons = options && options.notifierButtons || [];
      this.isOpened = true;
    },
    /**
     * Hide notifier window
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
      padding: 8px 15px;
    }

    &__title {
      font-size: 16px;
      font-weight: normal;
      vertical-align: middle;
      margin: 2px 14px 2px 0;
    }

    &__button {
      padding: 5px 11px;
      margin-right: 10px;
      border-radius: 13px;
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
