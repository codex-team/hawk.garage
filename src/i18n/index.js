import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messages from './messages/en';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: messages
  }
});

const loadedLanguages = [ 'en' ];

/**
 * Sets new i18n plugin locale
 * @param {String} lang - short language name
 * @return {String} - new language
 */
function setI18nLanguage(lang) {
  i18n.locale = lang;
  return lang;
}

/**
 * Download and set new locale
 * @param {String} lang - short language name
 * @return {Promise<*>}
 */
export async function loadLanguageAsync(lang) {
  // If the same language
  if (i18n.locale === lang) {
    return setI18nLanguage(lang);
  }

  // If the language was already loaded
  if (loadedLanguages.includes(lang)) {
    return setI18nLanguage(lang);
  }

  // If the language hasn't been loaded yet
  const newMessages = (await import(/* webpackChunkName: "lang-[request]" */ `./messages/${lang}.json`)).default;

  i18n.setLocaleMessage(lang, newMessages);
  loadedLanguages.push(lang);
  return setI18nLanguage(lang);
}

export default i18n;
