import BillingOverview from '../../../../../../components/workspace/settings/BillingOverview.vue';
import store from '../../../../../../store';
import router from '../../../../../../router';
import i18n from '../../../../../../i18n';

export default {
  components: BillingOverview,
  title: 'Billing/BillingOverview/FreePlan',
};

export const NormalState = (): unknown => ({
  components: { BillingOverview },
  template: `<BillingOverview
    :workspace="{
        billingPeriodEventsCount: 1000,
        description: null,
        id: '601d41b1c51c670023ab5cc7',
        image: null,
        name: 'Toolbox',
        subscriptionId: null,
        lastChargeDate: '2021-03-27T17:17:38.244+00:00',
        plan: {
          eventsLimit: 10000,
          id: '601d37621896b5004f1d0e3b',
          monthlyCharge: '0',
          name: 'Startup',
        },
        team: [{
          id: '601d41b1c51c670023ab5cc8',
          isAdmin: true,
          user: {
            email: '284491@niuitmo.ru',
            id: '601d3eb1c51c670023ab5cc6',
            image: 'http://127.0.0.1:4000/uploads/4b936143-6856-4127-834d-79b72224a221.jpeg',
          },
          __typename: 'ConfirmedMember',
        }]}"
  />`,
  store,
  router,
  i18n,
});

export const SubExpiredState = (): unknown => ({
  components: { BillingOverview },
  template: `<BillingOverview
    :workspace="{
        billingPeriodEventsCount: 1000,
        description: null,
        id: '601d41b1c51c670023ab5cc7',
        image: null,
        name: 'Toolbox',
        subscriptionId: null,
        lastChargeDate: '2021-02-22T17:17:38.244+00:00',
        plan: {
          eventsLimit: 10000,
          id: '601d37621896b5004f1d0e3b',
          monthlyCharge: '0',
          name: 'Startup',
        },
        team: [{
          id: '601d41b1c51c670023ab5cc8',
          isAdmin: true,
          user: {
            email: '284491@niuitmo.ru',
            id: '601d3eb1c51c670023ab5cc6',
            image: 'http://127.0.0.1:4000/uploads/4b936143-6856-4127-834d-79b72224a221.jpeg',
          },
          __typename: 'ConfirmedMember',
        }]}"
  />`,
  store,
  router,
  i18n,
});

export const VolumeExpiredState = (): unknown => ({
  components: { BillingOverview },
  template: `<BillingOverview
    :workspace="{
        billingPeriodEventsCount: 10000,
        description: null,
        id: '601d41b1c51c670023ab5cc7',
        image: null,
        name: 'Toolbox',
        subscriptionId: null,
        lastChargeDate: '2021-03-27T17:17:38.244+00:00',
        plan: {
          eventsLimit: 10000,
          id: '601d37621896b5004f1d0e3b',
          monthlyCharge: '0',
          name: 'Startup',
        },
        team: [{
          id: '601d41b1c51c670023ab5cc8',
          isAdmin: true,
          user: {
            email: '284491@niuitmo.ru',
            id: '601d3eb1c51c670023ab5cc6',
            image: 'http://127.0.0.1:4000/uploads/4b936143-6856-4127-834d-79b72224a221.jpeg',
          },
          __typename: 'ConfirmedMember',
        }]}"
  />`,
  store,
  router,
  i18n,
});
