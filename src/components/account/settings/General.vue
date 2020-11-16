<template>
  <div class="account-settings settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('settings.account.title') }}
    </div>
    <form @submit.prevent="save">
      <div class="account-settings__inline-elements">
        <FormTextFieldset
          v-model="name"
          class="account-settings__section account-settings__name-section"
          :label="$t('settings.account.name')"
          :placeholder="$t('settings.account.namePlaceholder')"
          required
          @input="showSubmitButton = true"
        />
        <section>
          <label class="label account-settings__label">{{ $t('settings.account.profileImage') }}</label>
          <FormImageUploader
            v-model="image"
            @input="showSubmitButton = true"
          />
        </section>
      </div>
      <FormTextFieldset
        v-model="email"
        auto-complete="username"
        class="account-settings__section"
        :label="$t('settings.account.email')"
        required
        placeholder="example@example.com"
        type="email"
        @input="showSubmitButton = true"
      />
      <ChangePasswordFieldset
        v-model="passwords"
        class="account-settings__section"
        :show-inputs.sync="showPasswordFieldset"
        @input="showSubmitButton = true"
      />
      <button
        v-if="showSubmitButton"
        class="button button--submit account-settings__submit-button"
      >
        {{ $t('settings.account.submit') }}
      </button>
    </form>
    <hr class="delimiter">
    <div class="account-settings__registered-info">
      Registered at Aug 25, 2019
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FormTextFieldset from '../../forms/TextFieldset.vue';
import FormImageUploader from '../../forms/ImageUploader.vue';
import ChangePasswordFieldset from '../../forms/ChangePasswordFieldset.vue';
import { CHANGE_PASSWORD, FETCH_CURRENT_USER, UPDATE_PROFILE } from '@/store/modules/user/actionTypes';
import notifier from 'codex-notifier';
import { User } from '@/types/user';

/**
 * This data will be send to update profile info
 */
interface UpdateAccountPayload {
  /**
   * If of a workspace to update
   */
  id: string;

  /**
   * New name
   */
  name: string;

  /**
   * New email
   */
  email: string;

  /**
   * Image file selected
   */
  image?: File;
}

export default Vue.extend({
  name: 'AccountSettings',
  components: {
    ChangePasswordFieldset,
    FormImageUploader,
    FormTextFieldset,
  },
  props: {
    /**
     * Current user
     */
    user: {
      type: Object as () => User,
      required: true,
    },
  },
  data() {
    const user = this.$store.state.user.data;

    return {
      name: user.name || '',
      email: user.email || '',
      /**
       * @param {string} image - URL to user image
       */
      image: user.image || '',
      passwords: {
        old: '',
        new: '',
      },
      showPasswordFieldset: false,
      showSubmitButton: false,
    };
  },
  methods: {
    /**
     * Form submit event handler
     */
    async save() {
      try {
        if (this.user.name !== this.name || this.user.email !== this.email || this.user.image !== this.image) {
          const payload = {
            name: this.name,
            email: this.email,
          } as UpdateAccountPayload;

          if (typeof this.image !== 'string') {
            payload.image = this.image;
          }

          await this.$store.dispatch(UPDATE_PROFILE, payload);
          await this.$store.dispatch(FETCH_CURRENT_USER);
        }

        if (this.passwords.old && this.passwords.new) {
          await this.$store.dispatch(CHANGE_PASSWORD, {
            old: this.passwords.old,
            new: this.passwords.new,
          });
        }

        this.hideForm();

        notifier.show({
          message: this.$t('settings.account.profileUpdated') as string,
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

    /**
     * Show password field set and submit button
     */
    async expandForm() {
      this.showPasswordFieldset = true;
      this.showSubmitButton = true;
    },

    /**
     * Hide password field set and submit button
     */
    async hideForm() {
      this.showPasswordFieldset = false;
      this.showSubmitButton = false;
    },
  },
});
</script>

<style src="../../../styles/settings-window-page.css"></style>

<style>
.account-settings {
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
