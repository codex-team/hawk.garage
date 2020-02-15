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
            v-model="project.image"
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

@Component({
  components: {
    FormTextFieldset,
    FormImageUploader
  }
})
/**
 * Class implements project settings content component
 */
export default class ProjectSettings extends Vue {
  /**
   * Show submit button only when you update some of fields
   */
  private showSubmitButton: boolean = false;

  /**
   * Name of project in form input
   */
  private _name!: string;

  /**
   * Getter for project name
   */
  get name() {
    this._name = this.project.name;
    return this._name;
  }

  /**
   * Setter for _name variable
   */
  set name(value: string) {
    this._name = value;
  }

  /**
   * Description of project in form input
   */
  private _description!: string;

  /**
   * Getter for project description
   */
  get description(): string {
    this._description = this.project.description;
    return this._description;
  }

  /**
   * Setter for _description variable
   */
  set description(value: string) {
    this._description = value;
  }

  /**
   * Image of project
   */
  private _image!: string;

  /**
   * Getter for project image
   */
  get image(): string {
    this._image = this.project.image;
    return this._image;
  }

  /**
   * Setter for _image variable
   */
  set image(value: string) {
    this._image = value;
  }

  /**
   * Current viewed project
   * @return {Project}
   */
  get project() {
    const projectId = this.$route.params.projectId;

    return this.$store.getters.getProjectById(projectId);
  }

  /**
   * Form submit event handler
   */
  async save() {
    try {
      if (
        this.project.name !== this._name ||
              this.project.description !== this._description ||
              this.project.image !== this._image
      ) {
        const payload = {
          id: this.project.id,
          name: this._name,
          description: this._description
        };

        console.log(payload);
      }

      this.showSubmitButton = false;

      notifier.show({
        message: this.$t('projects.settings.project.updatedMessage') as string,
        style: 'success',
        time: 5000
      });
    } catch (e) {
      notifier.show({
        message: e.message,
        style: 'error',
        time: 5000
      });
    }
  }
}
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
