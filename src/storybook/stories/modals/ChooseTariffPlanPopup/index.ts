import ChooseTariffPlanPopup from '@/components/modals/ChooseTariffPlanPopup.vue';
import store from '@/store';
import router from '@/router';
import i18n from '@/i18n';

export default {
  components: ChooseTariffPlanPopup,
  title: 'Modals/ChooseTariffPlanPopup',
};

export const Default = (): unknown => ({
  components: { ChooseTariffPlanPopup },
  template: `<ChooseTariffPlanPopup />`,
  store,
  router,
  i18n,
});
