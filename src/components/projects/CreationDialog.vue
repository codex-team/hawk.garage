<template>
  <PopupDialog @close="$emit('close')">
    <div class="project-creation-dialog">
      <h1 class="project-creation-dialog__header">
        Add a project
      </h1>
      <div class="project-creation-dialog__description">
        To start track events from your application, add it as a Project and get an Integration Token.
      </div>
      <form class="project-creation-dialog__form" @submit.prevent="createProject">
        <SelectWorkspace
          class="project-creation-dialog__select-workspaces"
          :workspaces="workspaces"
          v-model="workspaceId"
        />
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
import { CREATE_PROJECT, FETCH_WORKSPACES } from '../../store/actions/workspaces';
import PopupDialog from '../PopupDialog';
import TextFieldset from '../forms/TextFieldset';
import ImageUploader from '../forms/ImageUploader';
import SelectWorkspace from '../forms/SelectWorkspace';

export default {
  name: 'ProjectCreationDialog',
  data() {
    return {
      name: '',
      workspaceId: this.$store.state.workspaces.list[0].id
    };
  },
  methods: {
    /**
     * Creates new project
     */
    async createProject() {
      try {
        const projectInfo = {
          name: this.name,
          workspaceId: this.workspaceId
        };

        console.log(projectInfo);
        await this.$store.dispatch(CREATE_PROJECT, projectInfo);
        this.$store.dispatch(FETCH_WORKSPACES);

        this.$emit('close');
      } catch (e) {
        console.log(e);
      }
    }
  },
  computed: {
    /**
     * @return {Array<Workspace>} - registered workspaces
     */
    workspaces() {
      return this.$store.state.workspaces.list;
    }
  },
  components: {
    PopupDialog,
    TextFieldset,
    ImageUploader,
    SelectWorkspace
  }
};
</script>

<style>
  .project-creation-dialog {
    box-sizing: border-box;
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
      flex-basis: 100%;
    }
  }
</style>
