import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messages from './messages/en';

Vue.use(VueI18n);

const defaultPluralization = VueI18n.prototype.getChoiceIndex;

/**
 * Custom pluralization method for russian locale
 *
 * @param choice {number} a choice index given by the input to $tc: `$tc('path.to.rule', choiceIndex)`
 * @param choicesLength {number} an overall amount of available choices
 * @returns {number} index -  a final choice index to select plural word by
 */
VueI18n.prototype.getChoiceIndex = function (choice, choicesLength) {
  // this === VueI18n instance, so the locale property also exists here
  if (this.locale !== 'ru') {
    return defaultPluralization.call(this, choice, choicesLength);
  }

  if (choice === 0) {
    return 0;
  }

  const teen = choice > 10 && choice < 20;
  const endsWithOne = choice % 10 === 1;

  if (!teen && endsWithOne) {
    return 1;
  }

  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2;
  }

  return (choicesLength < 4) ? 2 : 3;
};

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
