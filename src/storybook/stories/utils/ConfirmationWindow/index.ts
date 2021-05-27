import ConfirmationWindow from '@/components/utils/ConfirmationWindow.vue';
import { withKnobs, text } from '@storybook/addon-knobs';
import centered from '@/storybook/decorators/centered';
import mdx from './docs.mdx';

export default {
  title: 'Utils/ConfirmationWindow',
  component: ConfirmationWindow,
  decorators: [withKnobs, centered],
  parameters: {
    docs: {
      page: mdx,
    },
  },
};

export const Continue = (): unknown => ({
  components: { ConfirmationWindow },
  template: `
    <ConfirmationWindow
      :title="title"
      :description="description"
    />
  `,
  props: {
    title: {
      type: String,
      default: text('Title', 'Confirm action'),
    },
    description: {
      type: String,
      default: text('Description', 'You are about to grant Admin priviledges to nick@codex.so'),
    },
  },
});

export const Deletion = (): unknown => ({
  components: { ConfirmationWindow },
  template: `
    <ConfirmationWindow
      :title="title"
      :description="description"
      :continue-button-text="continueButtonText"
      :deletion="deletion"
    />
  `,
  props: {
    title: {
      type: String,
      default: text('Title', 'Confirm action'),
    },
    description: {
      type: String,
      default: text('Description', 'You are about to delete the “beta.hawk.so” project from the workspace. Please, confirm your decision.'),
    },
    continueButtonText: {
      type: String,
      default: text('Continue button text', 'Delete project'),
    },
    deletion: {
      type: Boolean,
      default: true,
    },
  },
});

export const Default = (): unknown => ({
  components: { ConfirmationWindow },
  template: `
    <ConfirmationWindow/>
  `,
});
