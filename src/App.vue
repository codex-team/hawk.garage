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
import { setLanguage } from './i18n';
import { defineComponent } from 'vue';
import { useDemo } from './composables/useDemo';
import FeedbackButton from './components/utils/FeedbackButton.vue';

export default defineComponent({
  name: 'App',
  components: {
    FeedbackButton,
  },
  setup() {
    const { isEnabled: isDemoEnabled } = useDemo();

    return { isDemoEnabled };
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
        if (!accessToken && !this.isDemoEnabled.value) {
          this.$router.push('/login');
        }
        api.setAuthToken(accessToken);
      }
    );

    /**
     * Load user preferred language and setup watching on the app state
     */
    setLanguage(this.$store.state.app.language);
    this.$store.watch(
      state => state.app.language,
      (newLang) => {
        setLanguage(newLang);
      }
    );
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
  min-height: 100vh;
}
</style>
