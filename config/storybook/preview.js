import '../../src/styles/base.css';
import '../../src/styles/custom-properties.css';

import '../../src/filters';
import '../../src/directives';

import { addParameters } from '@storybook/vue';

addParameters({
  options: {
    showRoots: true,
  },
});
