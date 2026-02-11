/**
 * Mock database: Users
 *
 * Contains demo user data
 */

import type { User } from '@/types/user';

/**
 * Demo user account
 */
export const DEMO_USER: User = {
  id: 'user-demo-001',
  email: 'demo@hawk.so',
  name: 'Demo User',
  image: 'https://ui-avatars.com/api/?name=John+Dev&background=4ECDC4&color=fff',
};

/**
 * Additional team members for demo workspace
 */
export const DEMO_TEAM_MEMBERS: User[] = [
  {
    id: 'user-dev-001',
    email: 'john@example.com',
    name: 'John Developer',
    image: 'https://ui-avatars.com/api/?name=John+Dev&background=4ECDC4&color=fff',
  },
  {
    id: 'user-lead-001',
    email: 'sarah@example.com',
    name: 'Sarah Team Lead',
    image: 'https://ui-avatars.com/api/?name=Sarah+Lead&background=95E1D3&color=fff',
  },
];
