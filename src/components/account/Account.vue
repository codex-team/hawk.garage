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
          @input="showSubmitButton = true"
        />
        <section>
          <label class="label account-settings__label">{{ $t('settings.account.profileImage') }}</label>
          <FormImageUploader @change="showSubmitButton = true" />
        </section>
      </div>
      <FormTextFieldset
        v-model="email"
        class="account-settings__section"
        :label="$t('settings.account.email')"
        placeholder="example@example.com"
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
      <label class="label account-settings__label">
        GitHub
      </label>
      <div class="provider-row">
        <a
          v-if="!user.github"
          class="github-button account-settings__github-button"
          @click="linkGithub()"
        >{{ $t('settings.account.connect') }}</a>
        <div
          v-if="user.github"
          class="provider-row__content"
        >
          <EntityImage
            id="github"
            name="github-avatar"
            class="provider-row__image"
            :image="user.github.image"
          />
          <div class="provider-row__text">
            {{ user.github.username }}
          </div>
          <div
            class="button button--quiet provider-row__button"
            @click="disconnectGithub()"
          >
            {{ $t('settings.account.disconnect') }}
          </div>
        </div>
      </div>

      <label class="label account-settings__label">
        Google
      </label>
      <div class="provider-row">
        <a
          v-if="!user.google"
          class="google-button account-settings__google-button"
          @click="linkGoogle()"
        >{{ $t('settings.account.connect') }}</a>
        <div
          v-if="user.google"
          class="provider-row__content"
        >
          <EntityImage
            id="google"
            name="google-avatar"
            class="provider-row__image"
            :image="user.google.image"
          />
          <div class="provider-row__text">
            {{ user.google.email }}
          </div>
          <div
            class="button button--quiet provider-row__button"
            @click="disconnectGoogle()"
          >
            {{ $t('settings.account.disconnect') }}
          </div>
        </div>
      </div>
    </form>
    <hr class="delimiter">
    <div class="account-settings__registered-info">
      Registered at Aug 25, 2019
    </div>
  </div>
</template>

<script>
import FormTextFieldset from '../forms/TextFieldset';
import FormImageUploader from '../forms/ImageUploader';
import ChangePasswordFieldset from '../forms/ChangePasswordFieldset';
import EntityImage from '../utils/EntityImage';
import {
  CHANGE_PASSWORD,
  FETCH_CURRENT_USER,
  UPDATE_PROFILE
} from '../../store/modules/user/actionTypes';
import notifier from 'codex-notifier';
import { mapState } from 'vuex';

export default {
  name: 'AccountSettings',
  components: {
    ChangePasswordFieldset,
    FormImageUploader,
    FormTextFieldset,
    EntityImage
  },
  data() {
    const user = JSON.parse(JSON.stringify(this.$store.state.user.data));

    return {
      name: user.name || '',
      email: user.email || '',
      passwords: {
        old: '',
        new: ''
      },
      showPasswordFieldset: false,
      showSubmitButton: false
    };
  },
  computed: mapState({
    user: state => state.user.data
  }),
  created() {
    this.$store.dispatch(FETCH_CURRENT_USER);
  },
  methods: {
    /**
     * Form submit event handler
     */
    async save() {
      try {
        if (this.user.name !== this.name || this.user.email !== this.email) {
          await this.$store.dispatch(UPDATE_PROFILE, {
            name: this.name,
            email: this.email
          });
          await this.$store.dispatch(FETCH_CURRENT_USER);
        }

        if (this.passwords.old && this.passwords.new) {
          await this.$store.dispatch(CHANGE_PASSWORD, {
            old: this.passwords.old,
            new: this.passwords.new
          });
        }

        this.hideForm();

        notifier.show({
          message: this.$t('settings.account.profileUpdated'),
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
    async linkGithub() {
      window.location = `${this.$API_AUTH_GITHUB_LINK}?access_token=${this.$store.state.user.accessToken}`;
    },
    async linkGoogle() {
      window.location = `${this.$API_AUTH_GOOGLE_LINK}?access_token=${this.$store.state.user.accessToken}`;
    },
    async disconnectGithub() {
      window.location = `${this.$API_AUTH_GITHUB_UNLINK}?access_token=${this.$store.state.user.accessToken}`;
    },
    async disconnectGoogle() {
      window.location = `${this.$API_AUTH_GOOGLE_UNLINK}?access_token=${this.$store.state.user.accessToken}`;
    }
  }
};
</script>

<style src="../../styles/settings-window-page.css"></style>

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

    &__github-button {
      margin-left: 0;
    }

    &__google-button {
      margin-left: 0;
    }
  }

  .provider-row {
    margin-bottom: 20px;

    &__content {
      display: inline-flex;
      align-items: center;
      color: var(--color-text-second);
      font-size: 14px;
    }

    &__image {
      width: 34px;
      height: 34px;
      margin-right: 10px;
      border-radius: 4px;
    }

    &__text {
      margin-right: 30px;
    }

    &__button {
      /*display: inline-flex;*/
      /*align-items: center;*/
      /*justify-content: center;*/
      /*height: 34px;*/
      padding-right: 15px;
      padding-left: 15px;

      /*&:hover {*/
      /*  cursor: pointer;*/
      /*}*/
    }
  }

</style>
