<template>
  <PopupDialog @close="$emit('close')">
    <div class="project-creation-dialog">
      <h1 class="project-creation-dialog__header">
        {{ $t("projects.creationDialog.title") }}
      </h1>
      <div class="project-creation-dialog__description">
        {{ $t("projects.creationDialog.description") }}
      </div>
      <form
        class="project-creation-dialog__form"
        @submit.prevent="createProject"
      >
        <CustomSelect
          v-model="workspace"
          class="project-creation-dialog__select-workspaces"
          :options="workspaces"
          :label="$t('projects.creationDialog.workspaceSelectLabel')"
        />
        <TextFieldset
          v-model="name"
          class="project-creation-dialog__text-field"
          name="projectName"
          type="text"
          required
          :label="$t('projects.creationDialog.projectNameLabel')"
        />
        <ImageUploader
          v-model="image"
          class="project-creation-dialog__image-uploader"
        />
        <UiButton
          class="project-creation-dialog__submit"
          :submit="true"
          :content="$t('projects.creationDialog.submitButton')"
          :disabled="isSubmitting"
        />
      </form>
    </div>
  </PopupDialog>
</template>

<script>
import { CREATE_PROJECT } from '../../store/modules/projects/actionTypes';
import PopupDialog from '../utils/PopupDialog';
import UiButton from '../utils/UiButton';
import TextFieldset from '../forms/TextFieldset';
import ImageUploader from '../forms/ImageUploader';
import CustomSelect from '../forms/CustomSelect';
import notifier from 'codex-notifier';

export default {
  name: 'ProjectCreationDialog',
  components: {
    PopupDialog,
    TextFieldset,
    ImageUploader,
    CustomSelect,
    UiButton,
  },
  data() {
    return {
      name: '', // project name
      workspace: this.$store.state.workspaces.current || this.$store.state.workspaces.list[0], // project's workspace
      image: null,
      isSubmitting: false,
    };
  },
  computed: {
    /**
     * @returns {Array<Workspace>} - registered workspaces with permission check
     */
    workspaces() {
      const workspaces = this.$store.state.workspaces.list.filter((workspace) => {
        return this.$store.getters.isCurrentUserAdmin(workspace.id);
      });

      return workspaces;
    },
  },
  methods: {
    /**
     * Creates new project
     */
    async createProject() {
      try {
        const projectInfo = {
          name: this.name,
          workspaceId: this.workspace.id,
        };

        if (this.image) {
          projectInfo.image = this.image;
        }

        this.isSubmitting = true;

        const project = await this.$store.dispatch(CREATE_PROJECT, projectInfo);

        this.isSubmitting = false;

        this.$emit('close');

        /**
         * Open created Project page
         */
        this.$router.push(`/project/${project.id}/add-catcher`);
      } catch (e) {
        console.error(e);

        this.isSubmitting = false;

        notifier.show({
          message: e.message,
          style: 'error',
        });
      }
    },
  },
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
