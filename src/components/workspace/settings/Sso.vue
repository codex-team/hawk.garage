<template>
  <div class="workspace-settings-sso settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('workspaces.settings.sso.title') }}
    </div>

    <div class="workspace-settings-sso__description">
      {{ $t('workspaces.settings.sso.description') }}
    </div>

    <form @submit.prevent="save">
      <!-- Enable SSO -->
      <div class="workspace-settings-sso__section">
        <UiSwitch
          v-model="ssoConfig.enabled"
          :label="$t('workspaces.settings.sso.enable')"
          @update:model-value="onEnabledChange"
        />
      </div>

      <!-- SP Information (read-only) -->
      <div
        v-if="ssoConfig.enabled"
        class="settings-info"
      >
        <h3 class="settings-info__title">
          {{ $t('workspaces.settings.sso.spInfo.title') }}
        </h3>
        <p class="settings-info__hint">
          {{ $t('workspaces.settings.sso.spInfo.description') }}
        </p>
        <p class="settings-info__text">
          <label class="settings-info__label">
            {{ $t('workspaces.settings.sso.spInfo.entityId') }}
          </label>
          <CodeBlock
            language="plaintext"
            copyable
            class="settings-info__code-input"
          >
            {{ spEntityId }}
          </CodeBlock>
        </p>
        <p class="settings-info__text">
          <label class="settings-info__label">
            {{ $t('workspaces.settings.sso.spInfo.acsUrl') }}
          </label>
          <CodeBlock
            language="plaintext"
            copyable
            class="settings-info__code-input"
          >
            {{ acsUrl }}
          </CodeBlock>
        </p>
      </div>

      <!-- Enforce SSO -->
      <div
        v-if="ssoConfig.enabled"
        class="workspace-settings-sso__section"
      >
        <UiCheckboxWithLabel
          v-model="ssoConfig.enforced"
          :label="$t('workspaces.settings.sso.enforce')"
          @update:model-value="showSubmitButton = true"
        />
      </div>

      <!-- SAML Configuration -->
      <div v-if="ssoConfig.enabled">
        <!-- IdP Entity ID -->
        <div class="workspace-settings-sso__section">
          <FormTextFieldset
            v-model="ssoConfig.saml.idpEntityId"
            :label="$t('workspaces.settings.sso.entityId')"
            required
            @input="showSubmitButton = true"
          />
        </div>

        <!-- SSO URL -->
        <div class="workspace-settings-sso__section">
          <FormTextFieldset
            v-model="ssoConfig.saml.ssoUrl"
            :label="$t('workspaces.settings.sso.ssoUrl')"
            type="url"
            required
            @input="showSubmitButton = true"
          />
        </div>

        <!-- X.509 Certificate -->
        <div class="workspace-settings-sso__section">
          <label class="label workspace-settings-sso__label">
            {{ $t('workspaces.settings.sso.certificate') }}
          </label>
          <textarea
            v-model="ssoConfig.saml.x509Cert"
            class="textarea workspace-settings-sso__textarea"
            required
            rows="5"
            @input="showSubmitButton = true"
          />
        </div>

        <!-- NameID Format -->
        <div class="workspace-settings-sso__section">
          <CustomSelect
            v-model="selectedNameIdFormat"
            :options="nameIdFormatOptions"
            :label="$t('workspaces.settings.sso.nameIdFormat')"
            :need-image="false"
            @update:model-value="onNameIdFormatChange"
          />
        </div>

        <!-- Attribute Mapping -->
        <div class="workspace-settings-sso__section">
          <FormTextFieldset
            v-model="ssoConfig.saml.attributeMapping.email"
            :label="$t('workspaces.settings.sso.attributeMapping.email')"
            :placeholder="$t('workspaces.settings.sso.attributeMapping.emailPlaceholder')"
            required
            @input="showSubmitButton = true"
          />
        </div>

        <div class="workspace-settings-sso__section">
          <FormTextFieldset
            v-model="ssoConfig.saml.attributeMapping.name"
            :label="$t('workspaces.settings.sso.attributeMapping.name')"
            :placeholder="$t('workspaces.settings.sso.attributeMapping.namePlaceholder')"
            @input="showSubmitButton = true"
          />
        </div>
      </div>

      <button
        v-if="showSubmitButton"
        class="button button--submit workspace-settings-sso__submit-button"
        type="submit"
      >
        {{ $t('workspaces.settings.sso.save') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import FormTextFieldset from '../../forms/TextFieldset.vue';
import UiCheckboxWithLabel from '../../forms/UiCheckboxWithLabel/UiCheckboxWithLabel.vue';
import UiSwitch from '../../forms/UiSwitch.vue';
import CustomSelect from '../../forms/CustomSelect.vue';
import CodeBlock from '../../utils/CodeBlock.vue';
import notifier from 'codex-notifier';
import { UPDATE_WORKSPACE_SSO, FETCH_WORKSPACE_SSO_SETTINGS } from '@/store/modules/workspaces/actionTypes';
import type { Workspace, WorkspaceSsoConfigInput } from '@/types/workspaces';

/**
 * Props for the component
 */
interface Props {
  /**
   * Workspace which settings we are viewing
   * Passed from Layout.vue
   */
  workspace: Workspace;
}

/**
 * Emits for the component
 */
interface Emits {
  /**
   * Emitted when workspace is updated
   */
  (event: 'workspace-updated'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const store = useStore();
const { t } = useI18n();

/**
 * SSO configuration form data
 */
const ssoConfig = ref<WorkspaceSsoConfigInput>({
  enabled: false,
  enforced: true,
  saml: {
    idpEntityId: '',
    ssoUrl: '',
    x509Cert: '',
    nameIdFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    attributeMapping: {
      email: '',
      name: '',
    },
  },
});

/**
 * Button will be shown only when some fields are changed
 */
const showSubmitButton = ref(false);

/**
 * Service Provider Entity ID
 * This is the identifier for Hawk in the IdP configuration
 */
const spEntityId = computed((): string => {
  // @ts-ignore - import.meta.env is defined by Vite
  return import.meta.env.VITE_SSO_SP_ENTITY_ID || 'urn:hawk:tracker:saml';
});

/**
 * Assertion Consumer Service URL
 * This is the URL where IdP will send SAML responses
 */
const acsUrl = computed((): string => {
  // @ts-ignore - import.meta.env is defined by Vite
  const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';

  return `${apiUrl}/auth/sso/saml/${props.workspace.id}/acs`;
});

/**
 * NameID Format options for SAML configuration
 * CustomSelect expects objects with id and name properties
 */
const nameIdFormatOptions = computed(() => {
  return [
    {
      id: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
      name: 'Email Address',
    },
    {
      id: 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
      name: 'Persistent',
    },
    {
      id: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
      name: 'Transient',
    },
  ];
});

/**
 * Selected NameID Format as object for CustomSelect
 */
const selectedNameIdFormat = computed(() => {
  return nameIdFormatOptions.value.find(
    option => option.id === ssoConfig.value.saml.nameIdFormat
  ) || nameIdFormatOptions.value[0];
});

/**
 * Check if SSO configuration is filled with required fields
 *
 * @returns {boolean} true if all required fields are filled
 */
function isSsoConfigFilled(): boolean {
  const { saml } = ssoConfig.value;

  return !!(
    saml.idpEntityId
    && saml.ssoUrl
    && saml.x509Cert
    && saml.attributeMapping.email
  );
}

/**
 * Handle enabled switch change
 * If disabled, save immediately.
 * If enabled and config is filled, save immediately.
 *
 * @param value - new enabled state (true = enabled, false = disabled)
 */
async function onEnabledChange(value: boolean): Promise<void> {
  showSubmitButton.value = true;

  /**
   * If SSO is being disabled, save immediately
   */
  if (!value) {
    await save();

    return;
  }

  /**
   * If SSO is being enabled and configuration is already filled, save immediately
   */
  if (value && isSsoConfigFilled()) {
    await save();
  }
}

/**
 * Handle NameID Format change
 *
 * @param option - selected option object from CustomSelect
 * @param option.id - nameIdFormat URN value (e.g., urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress)
 * @param option.name - human-readable label for the format (e.g., "Email Address")
 */
function onNameIdFormatChange(option: {
  /**
   * NameID Format URN value
   */
  id: string;
  /**
   * Human-readable label
   */
  name: string;
}): void {
  ssoConfig.value.saml.nameIdFormat = option.id;
  showSubmitButton.value = true;
}

/**
 * Load SSO settings from API
 */
async function loadSsoSettings(): Promise<void> {
  try {
    const settings = await store.dispatch(FETCH_WORKSPACE_SSO_SETTINGS, props.workspace.id);

    if (settings) {
      ssoConfig.value = {
        enabled: settings.enabled,
        enforced: settings.enforced ?? true,
        saml: {
          idpEntityId: settings.saml.idpEntityId,
          ssoUrl: settings.saml.ssoUrl,
          x509Cert: settings.saml.x509Cert,
          nameIdFormat: settings.saml.nameIdFormat || 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
          attributeMapping: {
            email: settings.saml.attributeMapping.email,
            name: settings.saml.attributeMapping.name || '',
          },
        },
      };
    }
  } catch (error) {
    /**
     * If settings don't exist, use default values
     * This is expected for workspaces without SSO configured
     */
    // eslint-disable-next-line no-console
    console.debug('SSO settings not found, using defaults:', error);
  }
}

/**
 * Save SSO configuration
 */
async function save(): Promise<void> {
  try {
    /**
     * Transform config to match GraphQL input format
     */
    const configInput = {
      enabled: ssoConfig.value.enabled,
      enforced: ssoConfig.value.enforced,
      saml: {
        idpEntityId: ssoConfig.value.saml.idpEntityId,
        ssoUrl: ssoConfig.value.saml.ssoUrl,
        x509Cert: ssoConfig.value.saml.x509Cert,
        nameIdFormat: ssoConfig.value.saml.nameIdFormat,
        attributeMapping: {
          email: ssoConfig.value.saml.attributeMapping.email,
          name: ssoConfig.value.saml.attributeMapping.name || undefined,
        },
      },
    };

    await store.dispatch(UPDATE_WORKSPACE_SSO, {
      workspaceId: props.workspace.id,
      config: configInput,
    });

    showSubmitButton.value = false;

    notifier.show({
      message: t('workspaces.settings.sso.saved'),
      style: 'success',
      time: 5000,
    });

    emit('workspace-updated');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    notifier.show({
      message: t(`workspaces.settings.sso.errors.${message}`) || message,
      style: 'error',
      time: 5000,
    });
  }
}

onMounted(async () => {
  await loadSsoSettings();
});
</script>

<style src="../../../styles/settings-window-page.css"></style>

<style>
@import "../../../styles/custom-properties.css";

.workspace-settings-sso {
  width: 100%;

  &__description {
    margin-bottom: 24px;
    color: var(--color-text-second);
    font-size: 14px;
    line-height: 1.6em;
  }

  &__section {
    margin-bottom: 20px;
  }

  &__label {
    margin-bottom: 9px;
  }

  &__textarea {
    width: 100%;
    padding: 8px 10px;
    font-family: var(--font-monospace);
    font-size: 12px;
    line-height: 1.5em;
    color: var(--color-text-main);
    background: var(--color-bg-main);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: var(--color-accent);
    }
  }

  &__select {
    width: 100%;
    padding: 8px 10px;
    color: var(--color-text-main);
    background: var(--color-bg-main);
    border: 1px solid var(--color-border);
    border-radius: 6px;

    &:focus {
      outline: none;
      border-color: var(--color-accent);
    }
  }

  &__submit-button {
    margin-top: 20px;
  }

}

.settings-info {
  margin-top: 30px;
  margin-bottom: 40px;
  padding: 16px;
  background: var(--color-bg-second);
  border: 1px solid var(--color-border);
  border-radius: 6px;

  &__title {
    margin: 0 0 8px 0;
    color: var(--color-text-main);
    font-weight: 600;
    font-size: 14px;
  }

  &__hint {
    margin: 0 0 16px 0;
    color: var(--color-text-second);
    font-size: 13px;
    line-height: 1.6em;
  }

  &__text {
    margin: 12px 0 0 0;
    color: var(--color-text-main);
    font-size: 13px;
    line-height: 1.6em;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__label {
    display: block;
    margin-bottom: 9px;
    @mixin ui-label;
  }

  &__code-input {
    margin-top: 5px;
    padding: 10px 12px;
  }
}
</style>
