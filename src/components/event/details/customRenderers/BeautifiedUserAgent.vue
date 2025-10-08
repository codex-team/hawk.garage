<template>
  <span class="useragent">
    <span class="useragent__os">
      <Icon
        v-if="osIcon"
        :symbol="osIcon"
      />
      <template v-if="isNeedToShowOsName">
        {{ value.os }}
      </template>

      {{ value.osVersion }}
    </span>
    /
    <span class="useragent__browser">
      <Icon
        v-if="browserIcon"
        :symbol="browserIcon"
      />
      {{ value.browser }}

      {{ value.browserVersion }}
    </span>
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeautifiedUserAgent } from '@hawk.so/types';
import Icon from '@/components/utils/Icon.vue';

/**
 * Available icons list
 * Injected by Webpack Define Plugin
 */
declare const iconsAvailable: string[];

export default defineComponent({
  components: {
    Icon,
  },
  props: {
    /**
     * Addon value
     */
    value: {
      type: Object as PropType<BeautifiedUserAgent>,
      required: true,
    },
  },
  computed: {
    /**
     * Icon of OS
     */
    osIcon(): string | undefined {
      /**
       * OS name can be different for the same family
       * For example, 'max os x' should use 'macos.svg' icon
       */
      const aliases = {
        macos: [ 'mac os x' ],
      };

      if (!this.value.os) {
        return;
      }

      const os = this.value.os.toLowerCase();

      if (iconsAvailable.includes(os)) {
        return os;
      }

      let icon: string | undefined;

      Object.entries(aliases).forEach(([iconName, iconAliases]) => {
        iconAliases.forEach((alias) => {
          if (alias.toLowerCase() === os) {
            icon = iconName;
          }
        });
      });

      return icon;
    },

    /**
     * Icon of browser
     */
    browserIcon(): string | undefined {
      const aliases = {
        yandex: ['yabrowser', 'Yandex Browser'],
      };

      if (!this.value.browser) {
        return;
      }

      const browser = this.value.browser.toLowerCase();

      if (iconsAvailable.includes(browser)) {
        return browser;
      }

      let icon: string | undefined;

      Object.entries(aliases).forEach(([iconName, iconAliases]) => {
        iconAliases.forEach((alias) => {
          if (alias.toLowerCase() === browser) {
            icon = iconName;
          }
        });
      });

      return icon;
    },

    /**
     * Some logos already contains OS name, so we won't display it twice
     * For example macOS, iOS logos
     */
    isNeedToShowOsName(): boolean {
      const logosContainingName = ['macos', 'ios'];

      if (this.osIcon === undefined) {
        return true;
      }

      return logosContainingName.includes(this.osIcon) === false;
    },
  },
});
</script>

<style scoped>
  .useragent {
    display: flex;

    &__browser,
    &__os {
      display: flex;
      align-items: center;
      white-space: nowrap;
    }

    &__browser {
      margin-left: 10px;
    }

    &__os {
      margin-right: 10px;
    }

    .icon {
      width: 12px;
      max-width: 50px;
      height: 1em;
      margin-top: -1px;
      margin-right: 5px;

      &--macos {
        width: 44px;
        margin-top: -2px;
      }

      &--ios {
        width: 20px;
      }
    }
  }
</style>
