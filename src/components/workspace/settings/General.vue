<template>
  <div class="workspace-settings settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('workspaces.settings.workspace.title') }}
    </div>
    <form @submit.prevent="save">
      <div class="workspace-settings__inline-elements">
        <FormTextFieldset
          v-model="formName"
          class="workspace-settings__section workspace-settings__name-section"
          :label="$t('settings.account.name')"
          required
          @input="showSubmitButton = true"
        />
        <section>
          <label class="label workspace-settings__label">{{ $t('workspaces.settings.workspace.image') }}</label>
          <FormImageUploader
            v-model="formImage"
            @input="showSubmitButton = true"
          />
        </section>
      </div>
      <FormTextFieldset
        v-model="formDescription"
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
    <!--    <hr class="delimiter">-->
    <!--    <div class="workspace-settings__registered-info">-->
    <!--      {{ $t('workspaces.settings.workspace.created') }}-->
    <!--    </div>-->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FormTextFieldset from '../../forms/TextFieldset.vue';
import FormImageUploader from '../../forms/ImageUploader.vue';
import notifier from 'codex-notifier';
import { UPDATE_WORKSPACE } from '@/store/modules/workspaces/actionTypes';
import { Workspace } from '@/types/workspaces';

/**
 * This data will be send to update workspace
 */
interface UpdateWorkspacePayload {
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

export default Vue.extend({
  name: 'WorkspaceSettingsGeneral',
  components: {
    FormImageUploader,
    FormTextFieldset,
  },
  props: {
    /**
     * Workspace which settings we are viewing
     * Passed from {@link ./Layout.vue}
     */
    workspace: {
      type: Object as () => Workspace,
      required: true,
    },
  },
  data() {
    return {
      /**
       * Form data to send with save
       */
      formName: this.workspace.name,
      formDescription: this.workspace.description,
      formImage: this.workspace.image,

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
          id: this.workspace.id,
          name: this.formName,
          description: this.formDescription,
        } as UpdateWorkspacePayload;

        if (typeof this.formImage !== 'string') {
          payload.image = this.formImage;
        }

        await this.$store.dispatch(UPDATE_WORKSPACE, payload);

        this.showSubmitButton = false;

        notifier.show({
          message: this.$t('workspaces.settings.workspace.updatedMessage') as string,
          style: 'success',
          time: 5000,
        });

        this.$emit('workspaceUpdated');
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

<style src="../../../styles/settings-window-page.css"></style>

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
