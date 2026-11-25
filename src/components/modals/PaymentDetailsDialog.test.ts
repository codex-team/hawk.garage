import { afterEach, expect, it, vi } from 'vitest';
import { createApp, h, nextTick, type App } from 'vue';
import { createI18n } from 'vue-i18n';
import en from '../../i18n/messages/en.json';
import PaymentDetailsDialog from './PaymentDetailsDialog.vue';

let app: App | undefined;
let host: HTMLDivElement;

afterEach(() => {
  app?.unmount();
  host.remove();
  vi.unstubAllGlobals();
});

/**
 * Let the test inspect the dialog before the quote request finishes.
 */
function deferred<T>(): { promise: Promise<T>;
  resolve: (value: T) => void; } {
  let resolve: ((value: T) => void) | undefined;
  const promise = new Promise<T>((fulfill) => {
    resolve = fulfill;
  });

  if (!resolve) {
    throw new Error('The promise executor did not run');
  }

  return { promise,
    resolve };
}

it('displays the monthly price and keeps promo and checkout feedback separate', async () => {
  const plan = { name: 'Basic',
    eventsLimit: 1000,
    monthlyCharge: 100,
    monthlyChargeCurrency: 'RUB' };
  const quote = { plan,
    paymentAmount: 100,
    currency: 'RUB',
    isCardLinkOperation: false };
  const widgetPay = vi.fn();

  vi.stubGlobal('cp', { CloudPayments: class {
    public pay = widgetPay;
  } });

  const dispatch = vi.fn().mockResolvedValueOnce(quote);

  host = document.createElement('div');
  document.body.append(host);
  app = createApp({ render: () => h(PaymentDetailsDialog, { workspaceId: 'workspace',
    tariffPlanId: 'plan',
    isRecurrent: true }) });
  app.use(createI18n({ legacy: false,
    locale: 'en',
    messages: { en } }));
  app.component('i18n', { render: () => null });
  app.config.globalProperties.$store = {
    dispatch,
    getters: { getWorkspaceById: () => ({ id: 'workspace',
      name: 'Workspace' }),
    getPlanById: () => plan },
    state: { user: { data: { id: 'user',
      email: 'payer@example.test' } } },
  };
  app.mount(host);

  await vi.waitFor(() => {
    expect(host.querySelector('.payment-details__price-values')?.textContent?.trim()).toBe('100₽ / mo');
  });

  const pay = host.querySelector<HTMLButtonElement>('.payment-details__bottom-button')!;
  const revealPromo = host.querySelector<HTMLButtonElement>('.payment-details__promo-link')!;

  host.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach(checkbox => checkbox.click());
  await nextTick();

  const checkout = deferred<typeof quote>();

  dispatch.mockReturnValueOnce(checkout.promise);
  pay.click();
  await nextTick();
  expect(revealPromo.disabled).toBe(true);
  expect(pay.classList.contains('ui-button--loading')).toBe(true);

  checkout.resolve(quote);
  await vi.waitFor(() => expect(revealPromo.disabled).toBe(false));
  expect(widgetPay).toHaveBeenCalledTimes(1);
  revealPromo.click();
  await nextTick();

  const input = host.querySelector<HTMLInputElement>('.payment-details__promo input')!;
  const form = input.form!;
  const apply = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;

  input.value = 'SALE';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await nextTick();
  expect(pay.disabled).toBe(true);
  expect(form.querySelector<HTMLElement>('[role="status"]')?.style.display).not.toBe('none');
  expect(form.querySelector('[role="status"]')?.textContent).toContain(en.billing.promoCode.applyOrClear);

  const discounted = deferred<typeof quote>();

  dispatch.mockReturnValueOnce(discounted.promise);
  form.dispatchEvent(new Event('submit', { bubbles: true,
    cancelable: true }));
  await nextTick();
  expect(pay.disabled).toBe(true);
  expect(pay.classList.contains('ui-button--loading')).toBe(false);
  expect(apply.classList.contains('ui-button--loading')).toBe(true);

  discounted.resolve({ ...quote,
    paymentAmount: 80 });
  await vi.waitFor(() => expect(pay.disabled).toBe(false));
  expect(host.querySelector('.payment-details__original-price')?.textContent?.trim()).toBe('100₽ / mo');
  expect(host.querySelector('.payment-details__price-values span:last-child')?.textContent?.trim()).toBe('80₽');
});
