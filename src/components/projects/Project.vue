<template>
  <div class="projects-settings-page">
    <div class="settings-window-page__title">
      {{ $t('projects.settings.project.title') }}
    </div>
    <form
      v-if="project"
      @submit.prevent="save"
    >
      <div class="project-settings__form-fields">
        <div class="project-settings__fieldset">
          <FormTextFieldset
            @input="showSubmitButton = true"
            :label="$t('settings.account.name')"
            class="project-settings__section project-settings__name-section"
            required
            v-model="name"
          />
          <FormTextFieldset
            v-model="description"
            :label="$t('projects.settings.project.description')"
            :placeholder="$t('projects.settings.project.descriptionPlaceholder')"
            class="project-settings__section"
            @input="showSubmitButton = true"
          />
        </div>
        <section>
          <label class="label project-settings__label">{{ $t('projects.settings.project.image') }}</label>
          <FormImageUploader
            v-model="image"
            @input="showSubmitButton = true"
          />
        </section>
      </div>
      <button
        v-if="showSubmitButton"
        class="button button--submit project-settings__submit-button"
      >
        {{ $t('projects.settings.project.submit') }}
      </button>
    </form>
    <hr class="delimiter">
    <div class="project-settings__registered-info">
      {{ $t('projects.settings.project.created') }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FormTextFieldset from '../forms/TextFieldset.vue';
import FormImageUploader from '../forms/ImageUploader.vue';
import notifier from 'codex-notifier';
import { UPDATE_PROJECT } from '../../store/modules/projects/actionTypes';
import { Project } from '../../types/projects';

export default Vue.extend({
  name: 'ProjectSettings' as string,
  components: {
    FormImageUploader,
    FormTextFieldset,
  },
  data() {
    return {
      /**
       * Name of project
       */
      name: '' as string,

      /**
       * Description of project
       */
      description: '' as string,

      /**
       * Image of project
       */
      image: '' as string | File,

      /**
       * Show submit button only when you update some of fields
       */
      showSubmitButton: false as boolean,
    };
  },
  computed: {
    /**
     * Computed object of project that show in settings page
     */
    project(): Project {
      const projectId = this.$route.params.projectId;

      return this.$store.getters.getProjectById(projectId);
    },
  },
  mounted() {
    this.name = this.project.name;
    this.description = this.project.description || '';
    this.image = this.project.image || '';
  },
  methods: {
    /**
     * Form submit event handler
     */
    async save(): Promise<void> {
      try {
        if (
          this.project.name !== this.name ||
          this.project.description !== this.description ||
          this.project.image !== this.image
        ) {
          const payload: {
            id: string,
            name: string,
            description: string,
            image?: File
          } = {
            id: this.project.id,
            name: this.name,
            description: this.description,
          };

          if (typeof this.image !== 'string') {
            payload.image = this.image;
          }

          await this.$store.dispatch(
            UPDATE_PROJECT,
            payload
          );
        }
        this.showSubmitButton = false;
        notifier.show({
          message: this.$t('projects.settings.project.updatedMessage') as string,
          style: 'success',
          time: 5000,
        });
      } catch (e) {
        notifier.show({
          message: e.message,
          style: 'error',
          time: 5000,
        });
      }
    },
  },
});
</script>

<style src="../../styles/settings-window-page.css"></style>

<style>
  @import "../../styles/custom-properties.css";

  .project-settings {
    width: 100%;

    &__form-fields {
      @apply --clearfix;
    }

    &__fieldset {
      float: left;
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
