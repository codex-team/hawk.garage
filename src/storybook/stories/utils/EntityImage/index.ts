import EntityImage from '@/components/utils/EntityImage.vue';
import { withKnobs, number, text } from '@storybook/addon-knobs';
import centered from '@/storybook/decorators/centered';

export default {
  title: 'Utils/EntityImage',
  component: EntityImage,
  decorators: [withKnobs, centered],
  parameters: {
  },
};

/**
 * Shows how different sizes looks like
 */
export const Sizes = () => ({
  components: { EntityImage },
  template: `
    <div style="display: flex; align-items: flex-end; flex-wrap: wrap; max-width: 700px; justify-content: space-between;">
      <h4 style="flex-basis: 100%; color: var(--color-text-second); font-weight: bold; font-size: 12px; text-transform: uppercase;">
        Name with two words
      </h4>

      <EntityImage
        v-for="size in sizes"
        :name="nameTwoWords"
        :key="'2w:' + size"
        :size="size"
      />

      <h4 style="flex-basis: 100%; color: var(--color-text-second); font-weight: bold; font-size: 12px; text-transform: uppercase; margin-top: 50px">
        Name with one word
      </h4>

      <EntityImage
        v-for="size in sizes"
        :name="nameOneWord"
        :key="'1w:' + size"
        :size="size"
      />
    </div>
  `,
  props: {
    nameTwoWords: {
      type: String,
      default: text('Name', 'Peter Savchenko'),
    },
    nameOneWord: {
      type: String,
      default: text('Name (one word)', 'Peter'),
    },
    sizes: {
      type: Array,
      default: () => {
        return [
          number('Size 100', 100),
          number('Size 72', 72),
          number('Size 50', 50),
          number('Size 40', 40),
          number('Size 36', 36),
          number('Size 24', 24),
          number('Size 18', 18),
          number('Size 16', 16),
          number('Size 12', 12),
          number('Size 10', 10),
        ];
      },
    },
  },
});

/**
 * Shows how different colors looks like
 */
export const Colors = () => ({
  components: { EntityImage },
  template: `
    <div style="display: flex; align-items: flex-end">
      <EntityImage
        v-for="id in ids"
        :name="title"
        :id="id"
        :key="id"
        :size="size"
        style="margin: 20px;"
      />
    </div>
  `,
  props: {
    title: {
      type: String,
      default: 'Peter Savchenko'
    },
    size: {
      type: Number,
      default: number('Size', 36)
    },
    ids: {
      type: Array,
      default: () => {
        let arr = [] as string[];

        for (let i = 0; i < 16; i++){
          if (i % 2 === 0){
            continue;
          }
          arr.push(text('id ' + i, (0xe000|i).toString(16)));
        }
        return arr;
      },
    },
  },
});


/**
 * Shows how different colors looks like
 */
export const WithPhotos = () => ({
  components: { EntityImage },
  template: `
    <div style="display: flex; align-items: flex-end">
      <EntityImage
        v-for="user in users"
        :name="user.name"
        :image="user.image"
        :id="user.id"
        :key="user.id"
        :size="size"
        style="margin: 20px;"
      />
    </div>
  `,
  props: {
    title: {
      type: String,
      default: 'Peter Savchenko'
    },
    size: {
      type: Number,
      default: number('Size', 36)
    },
    users: {
      type: Array,
      default: () => {
        return [
          {
            id: 'user1',
            name: 'Peter Savchenko',
            image: 'https://codex.so/upload/users/avatar_1450707541.png',
          },
          {
            id: 'user2',
            name: 'Taly Guryn',
            image: 'https://codex.so/upload/users/b_75c0f13d4b9aa382b7fe9acfdabe6c0f.jpg',
          }
        ];
      },
    },
  },
});
