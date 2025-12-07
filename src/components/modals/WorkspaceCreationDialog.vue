<template>
  <PopupDialog @close="$emit('close')">
    <div class="workspace-creation-dialog">
      <h1 class="workspace-creation-dialog__header">
        {{ $t('workspaces.creationDialog.title') }}
      </h1>
      <div class="workspace-creation-dialog__description">
        {{ $t('workspaces.creationDialog.description') }}
      </div>
      <form
        class="workspace-creation-dialog__form"
        @submit.prevent="createWorkspace"
      >
        <TextFieldset
          v-model="name"
          class="workspace-creation-dialog__text-field"
          name="workspaceName"
          type="text"
          required
          :label="$t('workspaces.creationDialog.workspaceNameLabel')"
        />
        <ImageUploader
          v-model="image"
          class="workspace-creation-dialog__image-uploader"
        />
        <UiButton
          class="workspace-creation-dialog__submit"
          :submit="true"
          :content="$t('workspaces.creationDialog.submitButton')"
          :disabled="isSubmitting"
        />
      </form>
    </div>
  </PopupDialog>
</template>

<script>
import { CREATE_WORKSPACE, SET_CURRENT_WORKSPACE } from '../../store/modules/workspaces/actionTypes';
import PopupDialog from '../utils/PopupDialog';
import UiButton from '../utils/UiButton';
import TextFieldset from '../forms/TextFieldset';
import ImageUploader from '../forms/ImageUploader';
import notifier from 'codex-notifier';

export default {
  name: 'WorkspaceCreationDialog',
  components: {
    PopupDialog,
    TextFieldset,
    ImageUploader,
    UiButton,
  },
  data() {
    return {
      name: '',
      image: null,
      isSubmitting: false,
    };
  },
  methods: {
    /**
     * Creates new workspace
     */
    async createWorkspace() {
      try {
        const workspaceInfo = {
          name: this.name,
        };

        if (this.image) {
          workspaceInfo.image = this.image;
        }

        this.isSubmitting = true;

        const createdWorkspace = await this.$store.dispatch(CREATE_WORKSPACE, workspaceInfo);

        this.isSubmitting = false;
        this.$emit('close');

        /**
         * Open created workspace
         */
        this.$store.dispatch(SET_CURRENT_WORKSPACE, createdWorkspace);
      } catch (e) {
        console.error(e);

        this.isSubmitting = false;

        const dictKey = 'errors.' + e.message;

        notifier.show({
          message: this.$te(dictKey) ? this.$t(dictKey) : e.message,
          style: 'error',
        });
      }
    },
  },
};
</script>

<style>
  .workspace-creation-dialog {
    max-width: 500px;
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
