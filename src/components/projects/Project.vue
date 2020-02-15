<template>
  <div class="projects-settings-page">
    <div class="settings-window-page__title">
      {{ $t('projects.settings.project.title') }}
    </div>
    <form
      v-if="project"
      class="project-settings__form"
      @submit.prevent="save"
    >
      <div class="project-settings__fieldset">
        <FormTextFieldset
          v-model="project.name"
          class="project-settings__section project-settings__name-section"
          :label="$t('settings.account.name')"
          required
          @input="showSubmitButton = true"
        />
        <FormTextFieldset
          v-model="project.description"
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

@Component({
  components: {
    FormTextFieldset,
    FormImageUploader,
  },
})
/**
 * Class implements project settings content component
 */
export default class ProjectSettings extends Vue {
  /**
   * Current viewed project
   * @return {Project}
   */
  get project() {
    const projectId = this.$route.params.projectId;

    return this.$store.getters.getProjectById(projectId);
  }

  /**
   * Show submit button only when you update some of fields
   */
  private showSubmitButton: boolean = false;
}
</script>

<style src="../../styles/settings-window-page.css"></style>

<style>
  @import "../../styles/custom-properties.css";

  .project-settings {
    width: 100%;

    &__form {
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
