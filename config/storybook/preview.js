import '../../src/styles/base.css';
import '../../src/styles/custom-properties.css';

import '../../src/filters';
import '../../src/directives';

import i18n from '../../src/storybook/decorators/i18n';

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'App interface locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English'},
        { value: 'ru', right: '🇷🇺', title: 'Русский'},
      ]
    }
  }
}

export const parameters = {
  options: {
    showRoots: true,
  },
};

export const decorators = [i18n]
