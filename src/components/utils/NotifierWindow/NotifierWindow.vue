<template>
  <transition
    v-if="isOpened"
    name="notifier-dialog-animation"
    appear
    @close="close()"
  >
    <div class="notifier-dialog__wrapper">
      <div class="notifier-window">
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
          class="notifier-window__close-button"
          @click="
            () => {
              close();
            }
          "
        >
          <Icon symbol="close" />
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
    Icon,
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
      notifierButtons: [] as NotifierButton[],
    };
  },
  methods: {
    /**
     * Show notifier open window
     *
     * @param options - options for displaying
     */
    open(options?: NotifierWindowOptions) {
      this.description = (options && options.description) || '';
      this.notifierButtons = (options && options.notifierButtons) || [];
      this.isOpened = true;
    },
    /**
     * Hide notifier window
     */
    close() {
      this.isOpened = false;
    },
  },
});
</script>

<style>
@keyframes panel-in {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }

  80% {
    transform: translateY(-10px);
  }

  100% {
    transform: none;
  }
}

.notifier {
  &-dialog {
    will-change: opacity, transform;

    &-animation {
      &-enter-active {
        animation: panel-in 400ms ease-out;
      }
    }

    &__wrapper {
      position: fixed;
      right: 30px;
      bottom: 30px;
      z-index: 9995;
      background-color: var(--color-bg-second);
      border-radius: 12px;
      box-shadow: 0 10px 32px 1px rgba(0,0,0,0.48);
    }
  }
  &-window {
    display: flex;
    align-items: center;
    padding: 10px 15px;

    &__title {
      font-weight: normal;
      font-size: 16px;
      line-height: 22px;
      vertical-align: middle;
    }

    &__button {
      margin-right: 10px;
      margin-left: 17px;
      padding: 5px 11px;
      border-radius: 13px;
    }

    &__close-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin-left: 6px;
      cursor: pointer;

      svg {
        width: 14px;
        height: 14px;
      }
    }
  }
}
</style>
