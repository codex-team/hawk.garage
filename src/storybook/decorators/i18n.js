import router from '@/router';
import store from '@/store';
import i18n, { loadLanguageAsync } from '@/i18n';
import { SET_LANGUAGE } from '@/store/modules/app/actionTypes';

export default (story, context) => ({
  template: `<story/>`,
  props: {
    locale: {
      type: String,
      default: context.globals.locale,
    },
  },
  created() {
    this.$store.watch(
      state => state.app.language,
      newLang => {
        loadLanguageAsync(newLang);
      }
    );
  },
  watch: {
    locale: function (val) {
      this.$store.dispatch(SET_LANGUAGE, val);
    },
  },
  i18n,
  router,
  store,
});
