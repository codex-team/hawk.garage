<template>
  <PopupDialog @close="$emit('close')">
    <div class="project-creation-dialog">
      <h1 class="project-creation-dialog__header">
        Add a project
      </h1>
      <div class="project-creation-dialog__description">
        To start track events from your application, add it as a Project and get an Integration Token.
      </div>
      <form
        class="project-creation-dialog__form"
        @submit.prevent="createProject"
      >
        <CustomSelect
          v-model="workspace"
          class="project-creation-dialog__select-workspaces"
          :options="workspaces"
          label="SELECT WORKSPACE"
        />
        <TextFieldset
          v-model="name"
          class="project-creation-dialog__text-field"
          name="projectName"
          type="text"
          label="project name"
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
import { CREATE_PROJECT } from '../../store/modules/projects/methodsTypes';
import PopupDialog from '../utils/PopupDialog';
import TextFieldset from '../forms/TextFieldset';
import ImageUploader from '../forms/ImageUploader';
import CustomSelect from '../forms/CustomSelect';

export default {
  name: 'ProjectCreationDialog',
  components: {
    PopupDialog,
    TextFieldset,
    ImageUploader,
    CustomSelect
  },
  data() {
    return {
      name: '', // project name
      workspace: this.$store.state.workspaces.current || this.$store.state.workspaces.list[0] // project's workspace
    };
  },
  computed: {
    /**
     * @return {Array<Workspace>} - registered workspaces
     */
    workspaces() {
      return this.$store.state.workspaces.list;
    }
  },
  methods: {
    /**
     * Creates new project
     */
    async createProject() {
      try {
        const projectInfo = {
          name: this.name,
          workspaceId: this.workspace.id
        };

        await this.$store.dispatch(CREATE_PROJECT, projectInfo);

        this.$emit('close');
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style>
  .project-creation-dialog {
    max-width: 500px;
    max-height: 385px;
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

    &__select-workspaces {
      width: 280px;
      margin: 0 0 20px;
    }
  }
</style>
