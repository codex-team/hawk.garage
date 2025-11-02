<template>
  <div>
    <div class="settings-window-page__title">
      {{ $t('projects.settings.rateLimits.title') }}
    </div>
    <div class="project-settings__description">
      {{ $t('projects.settings.rateLimits.description') }}
    </div>
    <form class="project-settings__form" @submit.prevent>
      <div class="project-settings__rate-limit-fields">
        <TextFieldset
          v-model="selectedThreshold"
          type="number"
          :required="true"
          :is-invalid="!/^[1-9]\d*$/.test(selectedThreshold.toString())"
          :label="$t('common.threshold')"
          @input="showSubmitButton = true"
        />
        <TextFieldset
          v-model="periodSeconds"
          type="number"
          :required="true"
          :is-invalid="!/^[1-9]\d*$/.test(periodSeconds.toString())"
          :label="$t('projects.settings.rateLimits.period')"
          @input="showSubmitButton = true"
        />
      </div>

      <div class="project-settings__submit-area">
        <button
          v-if="showSubmitButton"
          class="button button--submit project-settings__submit-button"
        >
          {{ $t('projects.settings.rateLimits.submit') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TextFieldset from '../../forms/TextFieldset.vue';
import { Project } from '../../../types/project';

export default Vue.extend({
  name: 'RateLimits',
  components: {
    TextFieldset,
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
      selectedThreshold: this.project.rateLimitN?.toString() || '100',
      periodSeconds: this.project.rateLimitT?.toString() || '3600',
      showSubmitButton: false,
    };
  },
});
</script>

<style src="../../../styles/settings-window-page.css"></style>

<style>
@import url('../../../styles/custom-properties.css');

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

  &__description {
    width: 85%;
    margin-bottom: 20px;
    color: var(--color-text-main);
    font-weight: 400;
    font-size: 13px;
    line-height: 19px;
    opacity: 0.6;
  }

  &__rate-limit-fields {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    .form-fieldset__label {
      font-weight: 400;
      font-size: 13px;
      text-transform: none;
    }
  }

  &__section,
  &__submit-button {
    margin: 0 0 20px 0;
  }

  &__stats {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background-color: var(--color-bg-second);
    border-radius: 8px;
  }

  &__stat-label {
    margin-right: 10px;
    color: var(--color-text-second);
    font-size: 14px;
  }

  &__stat-value {
    color: var(--color-text-main);
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
