<template>
  <div>
    <div class="settings-window-page__title">
      {{ $t('projects.settings.general.title') }}
    </div>
    <form
      class="project-settings__form"
      @submit.prevent="save"
    >
      <div class="project-settings__fieldset">
        <FormTextFieldset
          v-model="formName"
          class="project-settings__section project-settings__name-section"
          :label="$t('settings.account.name')"
          required
          @input="showSubmitButton = true"
        />
        <FormTextFieldset
          v-model="formDescription"
          :label="$t('projects.settings.general.description')"
          :placeholder="$t('projects.settings.general.descriptionPlaceholder')"
          class="project-settings__section"
          @input="showSubmitButton = true"
        />
      </div>
      <section>
        <label class="label project-settings__label">{{ $t('projects.settings.general.image') }}</label>
        <FormImageUploader
          v-model="formImage"
          @input="showSubmitButton = true"
        />
      </section>

      <div class="project-settings__submit-area">
        <button
          v-if="showSubmitButton"
          class="button button--submit project-settings__submit-button"
        >
          {{ $t('projects.settings.general.submit') }}
        </button>
      </div>
    </form>
    <!--    <hr class="delimiter">-->
    <!--    <div class="project-settings__registered-info">-->
    <!--      {{ $t('projects.settings.general.created') }}-->
    <!--    </div>-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormTextFieldset from '../../forms/TextFieldset.vue';
import FormImageUploader from '../../forms/ImageUploader.vue';
import { Project } from '../../../types/project';
import { UPDATE_PROJECT } from '@/store/modules/projects/actionTypes';

import notifier from 'codex-notifier';

/**
 * This data will be send to update a project
 */
interface UpdateProjectPayload {
  /**
   * If of a workspace to update
   */
  id: string;

  /**
   * New name
   */
  name: string;

  /**
   * New description
   */
  description: string;

  /**
   * Image file selected
   */
  image?: File;
}

export default defineComponent({
  name: 'ProjectSettingsGeneral',
  components: {
    FormTextFieldset,
    FormImageUploader,
  },
  props: {
    /**
     * The project we are working with
     */
    project: {
      type: Object as () => Project,
      required: true,
    },
  },
  data() {
    return {
      /**
       * Form data to send with save
       */
      formName: this.project.name,
      formDescription: this.project.description,
      formImage: this.project.image,

      /**
       * Button will be showed only when some fields is changed
       */
      showSubmitButton: false,
    };
  },
  methods: {
    /**
     * Form submit event handler
     */
    async save(): Promise<void> {
      try {
        const payload = {
          id: this.project.id,
          name: this.formName,
          description: this.formDescription,
        } as UpdateProjectPayload;

        if (typeof this.formImage !== 'string') {
          payload.image = this.formImage;
        }

        await this.$store.dispatch(UPDATE_PROJECT, payload);

        this.showSubmitButton = false;

        notifier.show({
          message: this.$t('projects.settings.general.updatedMessage') as string,
          style: 'success',
          time: 5000,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        notifier.show({
          message,
          style: 'error',
          time: 5000,
        });
      }
    },
  },
});
</script>

<style src="../../../styles/settings-window-page.css"></style>

<style>

  .project-settings {
    width: 100%;

    &__form {
      display: flex;
      flex-wrap: wrap;
    }

    &__submit-area {
      flex-basis: 100%;
    }

    &__label {
      margin-bottom: 9px;
    }

    &__section {
      max-width: 280px;
    }

    &__section,
    &__submit-button {
      margin: 0 0 20px 0;
    }

    &__name-section {
      width: 280px;
      margin-right: 30px;
    }

    &__registered-info {
      margin-top: 15px;
      color: var(--color-text-second);
      font-size: 13px;
    }
  }
</style>
