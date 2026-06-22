<template>
  <div class="yandex-metrica">
    <div class="yandex-metrica__identifiers">
      <span class="yandex-metrica__identifier">
        <span class="yandex-metrica__label">
          {{ $t('components.yandexMetrica.counterId') }}
        </span>
        <code>{{ value.counterId }}</code>
      </span>
      <span class="yandex-metrica__identifier">
        <span class="yandex-metrica__label">
          {{ $t('components.yandexMetrica.clientId') }}
        </span>
        <code>{{ value.clientId }}</code>
      </span>
    </div>
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
  gap: 10px 16px;
  align-items: center;

  &__identifiers {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 16px;
  }

  &__identifier {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    white-space: nowrap;
  }

  &__label {
    color: var(--color-text-second);
  }

  &__link {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    color: var(--color-text-second);
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
