<template>
  <div
    id="app"
    ref="app"
    :class="[themeClass]"
  >
    <router-view />
    <FeedbackButton />
  </div>
</template>

<script lang="ts">
import * as api from './api/';
import eventBus from './eventBus';
import { loadLanguageAsync } from './i18n';
import Vue from 'vue';
import { NotifierButtonType } from './components/utils/NotifierWindow/types';
import FeedbackButton from './components/utils/FeedbackButton.vue';

export default Vue.extend({
  name: 'App',
  components: {
    FeedbackButton,
  },
  computed: {
    /**
     * Returns classname according to the theme name
     */
    themeClass(): string {
      return `app--theme--${this.$store.state.app.theme}`;
    },
  },

  /**
   * Vue hook. Called synchronously after the instance is created
   */
  created(): void {
    /**
     * Setup watching on auth state
     */
    this.$store.watch(
      state => state.user.accessToken,
      (accessToken) => {
        if (!accessToken) {
          this.$router.push('/login');
        }
        api.setAuthToken(accessToken);
      }
    );

    /**
     * Load user preferred language and setup watching on the app state
     */
    loadLanguageAsync(this.$store.state.app.language);
    this.$store.watch(
      state => state.app.language,
      (newLang) => {
        loadLanguageAsync(newLang);
      }
    );

    /**
     * Connect to the event bus
     */
    eventBus.$on('serviceWorkerUpdated', () => {
      this.$notify.open({
        description: this.$t('components.newVersionWindow.message') as string,
        notifierButtons: [{
          text: this.$t('components.newVersionWindow.refresh') as string,
          type: NotifierButtonType.SUBMIT,
          onClick: () => {
            window.location.reload();
          },
        }],
      });
    });
  },

  /**
   * Fired when all component nodes are ready
   */
  mounted(): void {
    /**
     * Prepare "ripple" effect
     */
    this.enableRipple();
  },

  methods: {
    /**
     * Add "ripple" effects: wave navigation on clicked elements
     * To active effect, add "data-ripple" attribute to any clickable element
     */
    enableRipple(): void {
      (this.$refs.app as HTMLElement)?.addEventListener('mousedown', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const el = target.nodeType === Node.ELEMENT_NODE ? target : target.parentElement;
        const rEl = el?.closest<HTMLElement>('[data-ripple]');

        if (!rEl) {
          return;
        }

        if (window.getComputedStyle(rEl).position === 'static') {
          rEl.style.position = 'relative';
        }

        const wrap = document.createElement('div');
        const rip = document.createElement('div');
        const offset = rEl.getBoundingClientRect();

        wrap.classList.add('ripple');
        rip.classList.add('ripple-wave');

        rip.style.left = e.pageX - offset.left + 'px';
        rip.style.top = e.pageY - offset.top + 'px';

        rEl.appendChild(wrap);
        wrap.appendChild(rip);

        setTimeout(() => {
          wrap.remove();
        }, 550);
      });
    },
  },
});
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
