import Badge from './Badge.vue';
import { withKnobs, number } from '@storybook/addon-knobs';
import centered from '../../storybook/addon-centered';
import mdx from './Badge.mdx';

export default {
  title: 'Utils/Badge',
  component: Badge,
  decorators: [withKnobs, centered],
  parameters: {
    docs: {
      page: mdx,
    },
  },
};

export const Types = () => ({
  components: { Badge },
  template: `
    <div>
      <Badge :content="content" />
      <Badge type="medium" :content="content" />
      <Badge type="critical" :content="content" />
      <Badge with-icon :content="content" />
    </div>
  `,
  props: {
    content: {
      type: Number,
      default: number('Content', 42),
    },
  },
});

export const Default = () => ({
  components: { Badge },
  template: `
    <Badge :content="content" />
  `,
  props: {
    content: {
      type: Number,
      default: number('Content', 42),
    },
  },
});

export const Medium = () => ({
  components: { Badge },
  template: `
    <Badge type="medium" :content="content" />
  `,
  props: {
    content: {
      type: Number,
      default: number('Content', 42),
    },
  },
});

export const Critical = () => ({
  components: { Badge },
  template: `
    <Badge type="critical" :content="content" />
  `,
  props: {
    content: {
      type: Number,
      default: number('Content', 42),
    },
  },
});
