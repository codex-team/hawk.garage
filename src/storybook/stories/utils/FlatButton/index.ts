import FlatButton from '@/components/utils/FlatButton.vue';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import centered from '@/storybook/decorators/centered';

export default {
  title: 'Utils/FlatButton',
  component: FlatButton,
  decorators: [withKnobs, centered],
};

const methods = {
  click: action('clicked'),
};

export const Default = (): unknown => ({
  components: { FlatButton },
  template: `
    <FlatButton :content="content" @click="click" />
  `,
  props: {
    content: {
      type: String,
      default: 'Click Me',
    },
  },
  methods,
});

export const Active = (): unknown => ({
  components: { FlatButton },
  template: `
    <FlatButton :content="content" @click="click" active />
  `,
  props: {
    content: {
      type: String,
      default: 'Click Me',
    },
  },
  methods,
});
