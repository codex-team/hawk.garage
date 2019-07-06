<template>
  <PopupDialog @close="$emit('close')">
    <div class="project-creation-dialog">
      <h1 class="project-creation-dialog__header">
        Create new project
      </h1>
      <div class="project-creation-dialog__description">
        Не забыть поменять тут текст
      </div>
      <form class="project-creation-dialog__form" @submit.prevent="createProject">
        <TextFieldset
          class="project-creation-dialog__text-field"
          name="projectName"
          type="text"
          label="project name"
          v-model="name"
        />
        <ImageUploader
          class="project-creation-dialog__image-uploader"
        />
        <input
          class="button button--submit project-creation-dialog__submit"
          type="submit"
          value="Create project"
        >
      </form>
    </div>
  </PopupDialog>
</template>

<script>
import { CREATE_PROJECT } from '../../store/actions/workspaces';
import PopupDialog from '../PopupDialog';
import TextFieldset from '../forms/TextFieldset';
import ImageUploader from '../forms/ImageUploader';

export default {
  name: 'ProjectCreationDialog',
  data() {
    return {
      name: ''
    };
  },
  methods: {
    /**
     * Creates new project
     */
    async createProject() {
      try {
        const projectInfo = {
          name: this.name
        };

        await this.$store.dispatch(CREATE_PROJECT, projectInfo);
        this.$emit('close');
      } catch (e) {
        console.log(e);
      }
    }
  },
  components: {
    PopupDialog,
    TextFieldset,
    ImageUploader
  }
};
</script>

<style>
  .project-creation-dialog {
    box-sizing: border-box;
    max-width: 500px;
    max-height: 300px;
    padding: 30px;

    &__header {
      margin: 0;
      font-weight: bold;
      font-size: 18px;
    }

    &__description {
      max-width: 363px;
      margin-top: 20px;
      color: var(--color-text-second);
      font-size: 14px;
      line-height: 1.43;
    }

    &__form {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      margin-top: 25px;
    }

    &__text-field {
      min-width: 280px;
    }

    &__image-uploader {
      margin-left: 30px;
    }

    &__submit {
      margin-top: 32px;
    }
  }
</style>
