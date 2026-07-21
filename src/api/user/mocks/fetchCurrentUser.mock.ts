/**
 * Mock: fetchCurrentUser
 *
 * Returns the demo user account
 */

import { DEMO_USER } from '@/api/mock-db';
import type { CurrentUser } from '@hawk.so/types';

export default function mockFetchCurrentUser(): {
  data: { me: CurrentUser };
  errors: unknown[];
} {
  return {
    data: {
      me: DEMO_USER,
    },
    errors: [],
  };
}
