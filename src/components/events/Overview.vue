<template>
  <PopupDialog
    @close="$router.push({name: 'project-overview', params: { projectId }})"
  >
    <div class="event-overview">
      <div class="event-overview__header">
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
      <div class="event-overview__info" />
    </div>
  </PopupDialog>
</template>

<script>
import PopupDialog from '../utils/PopupDialog';

export default {
  name: 'EventOverview',
  components: {
    PopupDialog
  },
  data() {
    const projectId = this.$route.params.projectId;
    const eventId = this.$route.params.eventId;
    const event = this.$store.getters.project(projectId).events.find(ev => ev.id === eventId);

    return {
      event,
      projectId
    };
  }
};
</script>

<style>
  .event-overview {
    min-width: 880px;

    &__header {
      display: flex;
      flex-direction: column;
      padding: 40px 40px 20px 40px;
      text-align: center;
      background-color: #121419;
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

    &__times,
    &__days-repeating,
    &__users-affected {
      display: inline-block;
      color: var(--color-text-second);
      font-size: 14px;
      text-align: center;
    }

    &__statistics-count {
      font-weight: bold;
      font-size: 20px;
      font-style: normal;
      letter-spacing: -0.45px;
    }

    &__days-repeating {
      margin: 0 60px;
    }

    &__filename {
      width: 100%;
      margin-top: 30px;
      font-size: 11px;
      font-family: Monaco, sans-serif;
      opacity: 0.3;
    }
  }
</style>
