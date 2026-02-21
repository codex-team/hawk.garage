import type { Plan } from '@/types/plan';

const DEMO_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Бесплатный',
    monthlyCharge: 0,
    monthlyChargeCurrency: 'RUB',
    eventsLimit: 1000,
    isDefault: true,
  },
  {
    id: 'basic',
    name: 'Базовый',
    monthlyCharge: 99,
    monthlyChargeCurrency: 'RUB',
    eventsLimit: 5000,
  },
  {
    id: 'hobby',
    name: 'Хобби',
    monthlyCharge: 190,
    monthlyChargeCurrency: 'RUB',
    eventsLimit: 10000,
  },
  {
    id: 'startup',
    name: 'Стартап',
    monthlyCharge: 950,
    monthlyChargeCurrency: 'RUB',
    eventsLimit: 50000,
  },
  {
    id: 'team',
    name: 'Командный',
    monthlyCharge: 3800,
    monthlyChargeCurrency: 'RUB',
    eventsLimit: 200000,
  },
  {
    id: 'enterprise',
    name: 'Корпоративный',
    monthlyCharge: 7500,
    monthlyChargeCurrency: 'RUB',
    eventsLimit: 500000,
  },
];

export default function mockGetPlans(): Plan[] {
  return DEMO_PLANS;
}
