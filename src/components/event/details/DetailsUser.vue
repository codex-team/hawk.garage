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
            <span v-if="payloadUser.name" class="event-details__user-name" :title="$t('event.user.name')">
              {{ payloadUser.name }}
            </span>
            <span v-if="payloadUser.id" class="event-details__user-id" :title="$t('event.user.id')">
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
              <Icon symbol="link-external" class="event-details__link-icon" />
            </a>
          </div>
        </div>
      </div>
    </template>
  </DetailsBase>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DetailsBase from './DetailsBase.vue';
import EntityImage from '../../utils/EntityImage.vue';
import Icon from '../../utils/Icon.vue';
import { AffectedUser } from '@hawk.so/types';

export default Vue.extend({
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
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__user-value {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__user-link-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 22px;
    padding: 0 6px;
    color: var(--color-text-second);
    border: none;
    border-radius: 4px;
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    flex-shrink: 0;

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
