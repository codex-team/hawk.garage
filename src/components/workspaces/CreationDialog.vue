<template>
  <PopupDialog @close="$emit('close')">
    <div class="workspace-creation-dialog">
      <h1 class="workspace-creation-dialog__header">
        Organize new workspace
      </h1>
      <div class="workspace-creation-dialog__description">
        Workspace will contain your projects. You’ll able to invite team members to join workspace and access projects.
      </div>
      <form class="workspace-creation-dialog__form" @submit.prevent="createWorkspace">
        <TextFieldset
          class="workspace-creation-dialog__text-field"
          name="workspaceName"
          type="text"
          label="workspace name"
          v-model="name"
        />
        <ImageUploader
          class="workspace-creation-dialog__image-uploader"
        />
        <input
          class="button button--submit workspace-creation-dialog__submit"
          type="submit"
          value="Create workspace"
        >
      </form>
    </div>
  </PopupDialog>
</template>

<script>
import { CREATE_WORKSPACE } from '../../store/actions/workspaces';
import PopupDialog from '../PopupDialog';
import TextFieldset from '../forms/TextFieldset';
import ImageUploader from '../forms/ImageUploader';

export default {
  name: 'WorkspaceCreationDialog',
  data() {
    return {
      name: ''
    };
  },
  methods: {
    /**
     * Creates new workspace
     */
    async createWorkspace() {
      try {
        const workspaceInfo = {
          name: this.name
        };

        await this.$store.dispatch(CREATE_WORKSPACE, workspaceInfo);
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
  .workspace-creation-dialog {
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
