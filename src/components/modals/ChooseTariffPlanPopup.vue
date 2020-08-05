<template>
  <PopupDialog @close="$emit('close')">
    <div class="choose-plan">
      <img
        class="choose-plan__hero"
        src="../../assets/landscape.svg"
      >
      <div class="choose-plan__content">
        <h2 class="choose-plan__title">
          {{ $t('workspaces.chooseTariffPlanDialog.title') }}
        </h2>
        <p
          class="choose-plan__description"
          v-html="$t('workspaces.chooseTariffPlanDialog.description', {featuresURL: '#'})"
        />
        <div class="choose-plan__plans">
          <TariffPlan
            v-for="(plan, i) in plans"
            :key="plan.name"
            :name="plan.name"
            :limit="plan.limit"
            :price="plan.price"
            :selected="i === selectedPlan"
            @click.native="selectPlan(i)"
          />
        </div>
        <UiButton
          class="choose-plan__continue-button"
          :content="$t('common.continue')"
          submit
          @click="$emit('close')"
        />
      </div>
    </div>
  </PopupDialog>
</template>

<script lang="ts">
import Vue from 'vue';
import PopupDialog from '../utils/PopupDialog.vue';
import TariffPlan from '../utils/TariffPlan.vue';
import UiButton from '../utils/UiButton.vue';

export default Vue.extend({
  name: 'ChooseTariffPlanPopup',
  components: {
    TariffPlan,
    PopupDialog,
    UiButton,
  },
  data() {
    return {
      /**
       * Available plan
       *
       * @todo Get plans from API
       */
      plans: [
        {
          name: 'Startup',
          limit: 10000,
          price: 0,
        }, {
          name: 'Basic',
          limit: 100000,
          price: 20,
        },
        {
          name: 'Big',
          limit: 1000000,
          price: 200,
        },
      ],
      /**
       * Selected plan index
       *
       * @todo Get default value from API
       */
      selectedPlan: 0,
    };
  },
  methods: {
    /**
     * Select plan card by index
     *
     * @param index - plan index
     */
    selectPlan(index: number) {
      if (index < 0 || index >= this.plans.length) {
        return;
      }

      this.selectedPlan = index;
    },
  },
});
</script>

<style>
  .choose-plan {
    max-width: 800px;
    background: var(--color-bg-second);

    &__content {
      padding: 30px 50px 35px;
    }

    &__title {
      margin-bottom: 10px;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0;
      color: var(--color-text-main);
    }

    &__description {
      max-width: 450px;
      margin: 0 0 20px;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0;
      color: var(--color-text-second);

      a:not([href*="mailto"]) {
        color: var(--color-indicator-medium);
      }
    }

    &__plans {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__continue-button {
      margin-top: 30px;
    }
  }
</style>
