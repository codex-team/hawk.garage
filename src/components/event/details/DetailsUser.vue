<template>
  <DetailsBase>
    <template #header>
      {{ $t('event.user.affectedUser') }}
    </template>
    <template #content>
      <div class="event-details__content-block">
        <div class="event-details__key">
          {{ $t('event.user.title') }}
        </div>
        <div class="event-details__value">
          <div class="event-details__user-value">
            <EntityImage
              :id="payloadUser.photo ? payloadUser.id : undefined"
              :name="payloadUser.photo ? payloadUser.name || payloadUser.id : undefined"
              :image="payloadUser.photo"
              size="22"
              :title="payloadUser.name || payloadUser.id || $t('event.user.noname')"
            />
            <span
              v-if="payloadUser.name"
              class="event-details__user-name"
              :title="$t('event.user.name')"
            >
              {{ payloadUser.name }}
            </span>
            <span
              v-if="payloadUser.id"
              class="event-details__user-id"
              :title="$t('event.user.id')"
            >
              ({{ payloadUser.id }})
            </span>
            <a
              v-if="payloadUser.url"
              :href="payloadUser.url"
              target="_blank"
              rel="noopener noreferrer"
              class="event-details__user-link-button"
              :title="$t('event.user.viewProfile')"
            >
              <span>{{ $t('event.user.link') }}</span>
              <Icon
                symbol="link-external"
                class="event-details__link-icon"
              />
            </a>
          </div>
        </div>
      </div>
    </template>
  </DetailsBase>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import DetailsBase from './DetailsBase.vue';
import EntityImage from '../../utils/EntityImage.vue';
import Icon from '../../utils/Icon.vue';
import { AffectedUser } from '@hawk.so/types';

export default defineComponent({
  name: 'DetailsUser',
  components: {
    DetailsBase,
    EntityImage,
    Icon,
  },
  props: {
    /**
     * Event user data
     */
    payloadUser: {
      type: Object as PropType<AffectedUser>,
      required: true,
    },
  },
});
</script>

<style>
.event-details {
  &__value {
    flex-direction: row;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
  }

  &__user-value {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  &__user-link-button {
    display: inline-flex;
    flex-shrink: 0;
    gap: 4px;
    align-items: center;
    justify-content: center;
    height: 22px;
    padding: 0 6px;
    color: var(--color-text-second);
    text-decoration: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;

    &:hover {
      color: var(--color-text-main);
    }
  }

  &__link-icon {
    width: 12px;
    height: 12px;
  }

  &__user-id {
    color: var(--color-text-second);
  }

  &__user-name {
    color: var(--color-text-main);
  }
}
</style>
