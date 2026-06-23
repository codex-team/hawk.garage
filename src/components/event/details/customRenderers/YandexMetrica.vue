<template>
  <div class="yandex-metrica">
    <div
      v-for="counter in counters"
      :key="counter.key"
      class="yandex-metrica__counter"
    >
      <span class="yandex-metrica__identifier yandex-metrica__identifier--counter">
        {{ $t('components.yandexMetrica.counterId') }}:
        <button
          type="button"
          class="yandex-metrica__copy-value"
          :title="$t('components.codeBlock.copy')"
          @click.stop="copyValue(String(counter.identifiers.counterId))"
        >
          {{ counter.identifiers.counterId }}
        </button>
      </span>
      /
      <span class="yandex-metrica__identifier yandex-metrica__identifier--client">
        {{ $t('components.yandexMetrica.clientId') }}:
        <button
          type="button"
          class="yandex-metrica__copy-value"
          :title="$t('components.codeBlock.copy')"
          @click.stop="copyValue(counter.identifiers.clientId)"
        >
          {{ counter.identifiers.clientId }}
        </button>
      </span>
      /
      <a
        :href="buildWebvisorUrl(counter.identifiers)"
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
interface YandexMetricaIdentifiers {
  /**
   * Yandex Metrica counter ID.
   */
  counterId: number;

  /**
   * Yandex Metrica visitor ClientID.
   */
  clientId: string;
}

type YandexMetricaAddon = YandexMetricaIdentifiers | Record<string, YandexMetricaIdentifiers>;

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
 * Checks whether a value contains one counter's Yandex Metrica identifiers.
 *
 * @param value - Value to check.
 */
const isYandexMetricaIdentifiers = (value: unknown): value is YandexMetricaIdentifiers => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const identifiers = value as Partial<YandexMetricaIdentifiers>;

  return Number.isSafeInteger(identifiers.counterId)
    && typeof identifiers.clientId === 'string'
    && identifiers.clientId.length > 0;
};

/**
 * Normalizes current multi-counter values and legacy single-counter events.
 */
const counters = computed(() => {
  if (isYandexMetricaIdentifiers(props.value)) {
    return [{
      key: '1',
      identifiers: props.value,
    }];
  }

  return Object.entries(props.value)
    .filter((entry): entry is [string, YandexMetricaIdentifiers] => {
      return isYandexMetricaIdentifiers(entry[1]);
    })
    .sort(([leftKey], [rightKey]) => Number(leftKey) - Number(rightKey))
    .map(([key, identifiers]) => ({
      key,
      identifiers,
    }));
});

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
 *
 * @param identifiers - Counter and ClientID used to build the link.
 */
const buildWebvisorUrl = (identifiers: YandexMetricaIdentifiers): string => {
  const query = new URLSearchParams({
    period: 'year',
    filter: `(EXISTS ym:u:userID WITH (ym:u:clientID==%27${identifiers.clientId}%27))`,
    id: String(identifiers.counterId),
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
};
</script>

<style scoped>
.yandex-metrica {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  color: inherit;
  font: inherit;
  padding-top: 4px;

  &__counter {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    color: inherit;
    font: inherit;
  }

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
