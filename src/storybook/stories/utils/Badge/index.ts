/* eslint-disable @typescript-eslint/no-magic-numbers */

import Badge from '@/components/utils/Badge.vue';
import { withKnobs, number } from '@storybook/addon-knobs';
import centered from '@/storybook/decorators/centered';
import mdx from './docs.mdx';


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

export const Types = (): unknown => ({
  components: { Badge },
  template: `
    <div>
      <Badge :content="content" />
      <Badge type="medium" :content="content" />
      <Badge type="critical" :content="content" />
    </div>
  `,
  props: {
    content: {
      type: Number,
      default: number('Content', 42),
    },
  },
});

export const Default = (): unknown => ({
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

export const Medium = (): unknown => ({
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

export const Critical = (): unknown => ({
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
