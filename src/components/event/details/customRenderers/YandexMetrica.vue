<template>
  <div class="yandex-metrica">
    <span class="yandex-metrica__identifier yandex-metrica__identifier--counter">
      {{ $t('components.yandexMetrica.counterId') }}:
      <button
        type="button"
        class="yandex-metrica__copy-value"
        :title="$t('components.codeBlock.copy')"
        @click.stop="copyValue(String(value.counterId))"
      >
        {{ value.counterId }}
      </button>
    </span>
    /
    <span class="yandex-metrica__identifier yandex-metrica__identifier--client">
      {{ $t('components.yandexMetrica.clientId') }}:
      <button
        type="button"
        class="yandex-metrica__copy-value"
        :title="$t('components.codeBlock.copy')"
        @click.stop="copyValue(value.clientId)"
      >
        {{ value.clientId }}
      </button>
    </span>
    /
    <a
      :href="webvisorUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="yandex-metrica__link"
      @click.stop
    >
      {{ $t('components.yandexMetrica.openWebvisor') }}
      <Icon
        symbol="link-external"
        class="yandex-metrica__link-icon"
      />
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import notifier from 'codex-notifier';
import Icon from '@/components/utils/Icon.vue';

/**
 * Yandex Metrica identifiers attached by the browser catcher.
 */
interface YandexMetricaAddon {
  /**
   * Yandex Metrica counter ID.
   */
  counterId: number;

  /**
   * Yandex Metrica visitor ClientID.
   */
  clientId: string;
}

/**
 * Yandex Metrica identifiers collected by the browser catcher.
 */
const props = defineProps<{
  /**
   * Yandex Metrica addon value.
   */
  value: YandexMetricaAddon;
}>();

const { t } = useI18n();

/**
 * Copies a Yandex Metrica identifier to the clipboard.
 *
 * @param value - Identifier to copy.
 */
const copyValue = async (value: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(value);

    notifier.show({
      message: t('common.copiedNotification'),
      style: 'success',
      time: 2000,
    });
  } catch {
    /**
     * Clipboard access can be denied by the browser.
     */
  }
};

/**
 * Builds a Yandex Metrica Webvisor URL filtered by ClientID.
 *
 * The quotes around ClientID are pre-encoded as `%27`. URLSearchParams
 * encodes the percent signs once more, producing the `%2527` expected by
 * the Metrica report filter.
 */
const webvisorUrl = computed(() => {
  const query = new URLSearchParams({
    period: 'year',
    filter: `(EXISTS ym:u:userID WITH (ym:u:clientID==%27${props.value.clientId}%27))`,
    id: String(props.value.counterId),
    group: 'week',
    isMinSamplingEnabled: 'false',
    currency: 'RUB',
    attr: JSON.stringify({
      attributionId: 'LastSign',
      isCrossDevice: true,
    }),
    isUndefinedEnabled: 'false',
  });

  return `https://metrika.yandex.ru/stat/visor?${query.toString()}`;
});
</script>

<style scoped>
.yandex-metrica {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  color: inherit;
  font: inherit;

  &__identifier {
    color: inherit;
    font: inherit;
    white-space: nowrap;

    &--counter {
      margin-right: 10px;
    }

    &--client {
      margin-right: 10px;
      margin-left: 10px;
    }
  }

  &__copy-value {
    padding: 0;
    color: inherit;
    font: inherit;
    background: none;
    border: 0;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  &__link {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    margin-left: 10px;
    color: inherit;
    font: inherit;
    text-decoration: none;
    white-space: nowrap;

    &:hover {
      color: var(--color-text-main);
    }
  }

  &__link-icon {
    width: 12px;
    height: 12px;
  }
}
</style>
