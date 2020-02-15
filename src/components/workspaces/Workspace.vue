<template>
  <div class="workspace-settings settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('workspaces.settings.workspace.title') }}
    </div>
    <form @submit.prevent="save">
      <div class="workspace-settings__inline-elements">
        <FormTextFieldset
          v-model="name"
          class="workspace-settings__section workspace-settings__name-section"
          :label="$t('settings.account.name')"
          required
          @input="showSubmitButton = true"
        />
        <section>
          <label class="label workspace-settings__label">{{ $t('workspaces.settings.workspace.image') }}</label>
          <FormImageUploader
            v-model="image"
            @input="showSubmitButton = true"
          />
        </section>
      </div>
      <FormTextFieldset
        v-model="description"
        class="workspace-settings__section"
        :label="$t('workspaces.settings.workspace.description')"
        :placeholder="$t('workspaces.settings.workspace.descriptionPlaceholder')"
        @input="showSubmitButton = true"
      />
      <button
        v-if="showSubmitButton"
        class="button button--submit workspace-settings__submit-button"
      >
        {{ $t('workspaces.settings.workspace.submit') }}
      </button>
    </form>
    <hr class="delimiter">
    <div class="workspace-settings__registered-info">
      {{ $t('workspaces.settings.workspace.created') }}
    </div>
  </div>
</template>

<script>
import FormTextFieldset from '../forms/TextFieldset';
import FormImageUploader from '../forms/ImageUploader';
import notifier from 'codex-notifier';
import { FETCH_WORKSPACE, UPDATE_WORKSPACE } from '../../store/modules/workspaces/actionTypes';

export default {
  name: 'WorkspaceSettings',
  components: {
    FormImageUploader,
    FormTextFieldset,
  },
  data() {
    const workspaceId = this.$route.params.workspaceId;

    this.workspace = this.$store.getters.getWorkspaceById(workspaceId);

    return {
      name: this.workspace.name,
      description: this.workspace.description || '',
      showSubmitButton: false,
      image: this.workspace.image,
    };
  },
  created() {
    this.fetchWorkspace();
  },
  methods: {
    async fetchWorkspace() {
      const workspaceId = this.$route.params.workspaceId;

      await this.$store.dispatch(FETCH_WORKSPACE, workspaceId);
    },
    /**
     * Form submit event handler
     */
    async save() {
      try {
        if (
          this.workspace.name !== this.name ||
          this.workspace.description !== this.description ||
          this.workspace.image !== this.image
        ) {
          const payload = {
            id: this.workspace.id,
            name: this.name,
            description: this.description,
          };

          if (typeof this.image !== 'string') {
            payload.image = this.image;
          }

          await this.$store.dispatch(
            UPDATE_WORKSPACE,
            payload
          );
        }

        this.showSubmitButton = false;

        this.fetchWorkspace();

        notifier.show({
          message: this.$t('workspaces.settings.workspace.updatedMessage'),
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
};
</script>

<style src="../../styles/settings-window-page.css"></style>

<style>
.workspace-settings {
  width: 100%;

  &__inline-elements {
    display: flex;
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
