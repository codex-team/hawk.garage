<template>
  <PopupDialog
    class="event-overview"
    @close="$router.push({name: 'project-overview', params: { projectId }})"
  >
    <div class="event-overview__container">
      <div class="event-overview__header">
        <Badge
          class="event-overview__badge"
          with-icon
          type="critical"
          content="FATAL ERROR"
        />
        <h1 class="event-overview__title">
          {{ event.payload.title }}
        </h1>
        <div class="event-overview__statistics">
          <div class="event-overview__times">
            <div class="event-overview__statistics-count">
              156
            </div>
            times
          </div>
          <div class="event-overview__days-repeating">
            <div class="event-overview__statistics-count">
              15
            </div>
            days repeating
          </div>
          <div class="event-overview__users-affected">
            <div class="event-overview__statistics-count">
              3 504
            </div>
            users affected
          </div>
        </div>
        <div class="event-overview__filename">
          /var/www/alpha.ifmo.su/www/vendor/pavelzotikov/social-covers-generator/src/SocialCoversGenerator/Types/BackgroundImage.php
        </div>
      </div>
      <div class="event-overview__info">
        <DetailsBacktrace
          v-if="event.payload.backtrace && event.payload.backtrace.length"
          class="event-overview__section"
          :backtrace="event.payload.backtrace"
        />
        <DetailsCookie
          v-if="event.payload.cookies && event.payload.cookies.length"
          class="event-overview__section"
          :cookies="event.payload.cookies"
        />
      </div>
    </div>
  </PopupDialog>
</template>

<script>
import PopupDialog from '../utils/PopupDialog';
import DetailsCookie from './DetailsCookie';
import DetailsBacktrace from './DetailsBacktrace';
import Badge from '../utils/Badge';

export default {
  name: 'EventOverview',
  components: {
    PopupDialog,
    DetailsCookie,
    DetailsBacktrace,
    Badge
  },
  data() {
    const projectId = this.$route.params.projectId;
    const eventId = this.$route.params.eventId;
    const event = this.$store.getters.project(projectId).events.find(ev => ev.id === eventId);

    event.payload.cookies = [
      { key: 'session', value: 'jqquuf36fq01l9jlbmjsgf93hi' },
      {
        key: 'auth_token',
        value: '85fa65fad6a6006af2199533e2db7c515dcf1f1a~f9dd12459e993f1d178655ed9edfb252fba3d72485fa65fad6a6006af2199533e2db7c515dcf1f1a~f9dd12459e993f1d178655ed9edfb252fba3d72485fa65fad6a6006af2199533e2db7c515dcf1f1a~f9dd12459e993f1d'
      },
      { key: 'SIDCC', value: 'AN0-TYujb2wn-aCaJlABxCr33fkyJlZ31TAjxVYjZAa7SAsrTES16WEz_hT2Fz-1Sfqkm2iyWQY' },
      { key: '_ym_id', value: 'jqquuf36fq01l9jlbmjsgf93hi' },
      { key: '_ga', value: 'jqquuasdadasdasf36fq01l9jlbmjsgf93hi' }
    ];

    return {
      event,
      projectId
    };
  }
};
</script>

<style>
  .event-overview {

    /** Override Popup Dialog animation */
    &.popup-dialog-animation {
      &-enter-active {
        transition: all 100ms ease;
      }

      &-enter {
        transform: scale(1.02);
        opacity: 1;
      }

      &-enter-to {
        transform: none;
      }

      &-leave-active {
        transition: none;
      }
    }

    &__container {
      max-width: 850px;
    }

    &__header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 40px 40px 20px 40px;
      text-align: center;
      background-color: #121419;
    }

    &__badge {
      display: inline-flex;
      height: 23px;
      margin: 0 auto;
      padding: 5px 8px 5px 10px;
      border-radius: 4px;
    }

    &__title {
      flex-basis: 100%;
      flex-grow: 1;
      max-width: 650px;
      margin: 0 auto;
      padding: 30px 0;
      font-weight: bold;
      font-size: 24px;
      line-height: 1.25;
    }

    &__statistics {
      position: relative;
      margin: 0 auto;
    }

    &__times {
      left: -60px;
      transform: translateX(-100%);
    }

    &__users-affected {
      right: -60px;
      transform: translateX(100%);
    }

    &__times,
    &__users-affected {
      position: absolute;
    }

    &__times,
    &__days-repeating,
    &__users-affected {
      display: inline-block;
      color: var(--color-text-second);
      font-size: 14px;
      text-align: center;
    }

    &__statistics-count {
      margin-bottom: 4px;
      font-weight: bold;
      font-size: 20px;
      font-style: normal;
      letter-spacing: -0.45px;
    }

    &__filename {
      width: 100%;
      margin-top: 30px;
      font-size: 11px;
      font-family: var(--font-monospace);
      line-height: 1.4;
      opacity: 0.3;
    }

    &__info {
      padding: 30px 20px 0 20px;
    }

    &__section {
      margin-bottom: 30px;
    }
  }
</style>
