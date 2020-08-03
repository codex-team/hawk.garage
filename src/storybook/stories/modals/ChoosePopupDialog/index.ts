import ChoosePopupDialog from '@/components/modals/ChoosePopupDialog.vue';
import store from '@/store';
import router from '@/router';
import i18n from '@/i18n';

export default {
  components: ChoosePopupDialog,
  title: 'Modals/ChoosePopupDialog',
};

export const Default = (): unknown => ({
  components: { ChoosePopupDialog },
  template: `<ChoosePopupDialog />`,
  store,
  router,
  i18n,
});
