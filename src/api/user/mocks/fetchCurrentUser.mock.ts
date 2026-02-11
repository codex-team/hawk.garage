/**
 * Mock: fetchCurrentUser
 *
 * Returns the demo user account
 */

import { DEMO_USER } from '@/api/mock-db';

export default function mockFetchCurrentUser() {
  return {
    data: {
      me: DEMO_USER,
    },
    errors: [],
  };
}
