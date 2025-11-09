import ConfirmationWindow from '@/components/utils/ConfirmationWindow/ConfirmationWindow.vue';
import UiButton from '@/components/utils/UiButton.vue';
import { radios, text, withKnobs } from '@storybook/addon-knobs';
import centered from '@/storybook/decorators/centered';
import mdx from './docs.mdx';
import { ActionType } from '../../../../components/utils/ConfirmationWindow/types';
import type { PropType } from 'vue';

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
  components: { UiButton },
  template: `
    <UiButton
      content="Click me"
      submit
      @click="$confirm.open({
        title,
        description
      })"
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
  components: { UiButton },
  template: `
    <UiButton
      content="Click me"
      submit
      @click="$confirm.open({
        title,
        description,
        continueButtonText,
        actionType
      })"
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
    actionType: {
      type: String as PropType<ActionType>,
      default: radios('Action type', {
        Submit: ActionType.SUBMIT,
        Deletion: ActionType.DELETION,
      }, ActionType.DELETION),
    },
  },
});

export const Default = (): unknown => ({
  components: { UiButton },
  template: `
    <UiButton
      content="Click me"
      submit
      @click="$confirm.open()"
    />
  `,
});
