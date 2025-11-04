import UiCheckboxWithLabel from '@/components/forms/UiCheckboxWithLabel/UiCheckboxWithLabel.vue';
import centered from '@/storybook/decorators/centered';
import mdx from './docs.mdx';

export default {
  title: 'Forms/UiCheckboxWithLabel',
  component: UiCheckboxWithLabel,
  decorators: [centered],
  parameters: {
    docs: {
      page: mdx,
    },
  },
};

export const Default = (): unknown => ({
  components: { UiCheckboxWithLabel },
  template: `
    <UiCheckboxWithLabel
      name="isChecked"
      label="Check me!"
      v-model="checked"
    />
  `,
  data() {
    return {
      checked: false,
    };
  },
});
