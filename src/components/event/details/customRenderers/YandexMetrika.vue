<template>
  <div class="yandex-metrika">
    <div
      v-for="counter in counters"
      :key="counter.key"
      class="yandex-metrika__counter"
    >
      <span class="yandex-metrika__counter-client-id yandex-metrika__counter-client-id--counter">
        {{ $t('components.yandexMetrika.counterId') }}:
        <button
          v-copyable="{
            selector: '.yandex-metrika__copy-value-text',
            callback: onValueCopied,
          }"
          type="button"
          class="yandex-metrika__copy-value"
          :title="$t('components.codeBlock.copy')"
          @click.stop
        >
          <span class="yandex-metrika__copy-value-text">{{ counter.counterClientId.counterId }}</span>
        </button>
      </span>
      /
      <span class="yandex-metrika__counter-client-id yandex-metrika__counter-client-id--client">
        {{ $t('components.yandexMetrika.clientId') }}:
        <button
          v-copyable="{
            selector: '.yandex-metrika__copy-value-text',
            callback: onValueCopied,
          }"
          type="button"
          class="yandex-metrika__copy-value"
          :title="$t('components.codeBlock.copy')"
          @click.stop
        >
          <span class="yandex-metrika__copy-value-text">{{ counter.counterClientId.clientId }}</span>
        </button>
      </span>
      /
      <a
        :href="buildWebvisorUrl(counter.counterClientId)"
        target="_blank"
        rel="noopener noreferrer"
        class="yandex-metrika__link"
        @click.stop
      >
        {{ $t('components.yandexMetrika.openWebvisor') }}
        <Icon
          symbol="link-external"
          class="yandex-metrika__link-icon"
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
 * Yandex Metrika counter ID paired with its visitor ClientID.
 */
interface YandexMetrikaCounterClientId {
  /**
   * Yandex Metrika counter ID.
   */
  counterId: number;

  /**
   * Yandex Metrika visitor ClientID.
   */
  clientId: string;
}

type YandexMetrikaAddon = YandexMetrikaCounterClientId | Record<string, YandexMetrikaCounterClientId>;

/**
 * Yandex Metrika counters ClientIDs collected by the browser catcher.
 */
const props = defineProps<{
  /**
   * Yandex Metrika addon value.
   */
  value: YandexMetrikaAddon;
}>();

const { t } = useI18n();

/**
 * Checks whether a value contains one Yandex Metrika counter ClientID.
 *
 * @param value - Value to check.
 */
const isYandexMetrikaCounterClientId = (value: unknown): value is YandexMetrikaCounterClientId => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const counterClientId = value as Partial<YandexMetrikaCounterClientId>;

  return Number.isSafeInteger(counterClientId.counterId)
    && typeof counterClientId.clientId === 'string'
    && counterClientId.clientId.length > 0;
};

/**
 * Normalizes current multi-counter values and legacy single-counter events.
 */
const counters = computed(() => {
  if (isYandexMetrikaCounterClientId(props.value)) {
    return [{
      key: '1',
      counterClientId: props.value,
    }];
  }

  return Object.entries(props.value)
    .filter((entry): entry is [string, YandexMetrikaCounterClientId] => {
      return isYandexMetrikaCounterClientId(entry[1]);
    })
    .sort(([leftKey], [rightKey]) => Number(leftKey) - Number(rightKey))
    .map(([key, counterClientId]) => ({
      key,
      counterClientId,
    }));
});

/**
 * Shows notification after copyable directive copies a value.
 */
const onValueCopied = (): void => {
  notifier.show({
    message: t('common.copiedNotification'),
    style: 'success',
    time: 2000,
  });
};

/**
 * Builds a Yandex Metrika Webvisor URL filtered by ClientID.
 *
 * The quotes around ClientID are pre-encoded as `%27`. URLSearchParams
 * encodes the percent signs once more, producing the `%2527` expected by
 * the Metrika report filter.
 *
 * @param counterClientId - Counter and ClientID used to build the link.
 */
const buildWebvisorUrl = (counterClientId: YandexMetrikaCounterClientId): string => {
  const query = new URLSearchParams({
    period: 'year',
    filter: `(EXISTS ym:u:userID WITH (ym:u:clientID==%27${counterClientId.clientId}%27))`,
    id: String(counterClientId.counterId),
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
.yandex-metrika {
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

  &__counter-client-id {
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
