import UiButton from '@/components/utils/UiButton.vue';
import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import centered from '@/storybook/decorators/centered';

console.log(action);

export default {
  title: 'Utils/UiButton',
  component: UiButton,
  decorators: [withKnobs, centered],
};

const methods = {
  click: action('clicked'),
};

export const Default = (): unknown => ({
  components: { UiButton },
  template: `
    <UiButton :content="content" @click="click" />
  `,
  props: {
    content: {
      type: String,
      default: 'Click Me',
    },
  },
  methods,
});

export const WithIcon = (): unknown => ({
  components: { UiButton },
  template: `
    <UiButton content="Click Me" icon="bell" @click="click" />
  `,
  methods,
});

export const Submit = (): unknown => ({
  components: { UiButton },
  template: `
    <UiButton content="Click Me" submit @click="click" />
  `,
  methods,
});

export const Small = (): unknown => ({
  components: { UiButton },
  template: `
    <UiButton content="Click Me" small @click="click" />
  `,
  methods,
});

export const Loading = (): unknown => ({
  components: { UiButton },
  template: `
    <UiButton content="Click Me" is-loading @click="click" />
  `,
  methods,
});

export const WithKnobs = (): unknown => ({
  components: { UiButton },
  template: `
    <UiButton :content="content" :icon="icon" :submit="submit" :small="small" :is-loading="isLoading" @click="click" />
  `,
  props: {
    content: {
      type: String,
      default: text('Content', 'Click me'),
    },
    icon: {
      type: String,
      default: text('Icon', ''),
    },
    submit: {
      type: Boolean,
      default: boolean('Submit', false),
    },
    small: {
      type: Boolean,
      default: boolean('Small', false),
    },
    isLoading: {
      type: Boolean,
      default: boolean('isLoading', false),
    },
  },
  methods,
});
