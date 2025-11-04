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
                <!-- Debug -->
      <pre style=" padding: 10px; margin-bottom: 10px;">{{ JSON.stringify(payloadUser) }}</pre>

          <div class="event-details__user-value">
            <EntityImage
              :id="payloadUser ? payloadUser.id : undefined"
              :name="payloadUser ? payloadUser.name : undefined"
              :image="payloadUser ? payloadUser.photo : undefined"
              size="22"
              :title="payloadUser.name || payloadUser.id || $t('event.user.noname')"
            />
            <span v-if="payloadUser.id" class="event-details__user-id">
              {{ payloadUser.id }}
            </span>
            <span v-if="payloadUser.name">/</span>
            <span v-if="payloadUser.name" class="event-details__user-name">
              {{ payloadUser.name }}
            </span>
            <span v-if="payloadUser.url">/</span>
            <a
              v-if="payloadUser.url"
              :href="payloadUser.url"
              target="_blank"
              class="event-details__user-url"
              :title="$t('event.user.viewProfile')"
            >
              {{ payloadUser.url }}
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
import { EventUser } from '@/types/events';

export default Vue.extend({
  name: 'DetailsUser',
  components: {
    DetailsBase,
    EntityImage,
  },
  props: {
    /**
     * Event user data
     */
    payloadUser: {
      type: Object as PropType<EventUser>,
      required: true,
    },
  },
});
</script>

<style>
.event-details {
  &__user-value {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  &__user-id {
    font-family: var(--font-monospace);
  }

  &__user-name {
    font-weight: 500;
    color: var(--color-text-main);
  }

  &__user-url {
    /* color: var(--color-link); */
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
