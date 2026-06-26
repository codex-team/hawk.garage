/**
 * Mock database: Users
 *
 * Contains demo user data
 */

import type { User } from '@hawk.so/types';

export const DEMO_CURRENT_USER_AVATAR_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQXCh1JJCjU9M15ooSVdvgrbB_rUGwWF4VUrVSLuro_g&s=10';
export const DEMO_AFFECTED_USER_ID = 'user-john-doe';
export const DEMO_AFFECTED_USER_PROFILE_URL = `https://demo.hawk.so/users/${DEMO_AFFECTED_USER_ID}`;
export const DEMO_AFFECTED_USER_AVATAR_URL = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80';

/**
 * Demo user account
 */
export const DEMO_USER: User = {
  id: 'user-alex-morgan',
  email: 'alex.morgan@hawk.so',
  name: 'Alex Morgan',
  image: DEMO_CURRENT_USER_AVATAR_URL,
};

export const DEMO_AFFECTED_USER = {
  id: DEMO_AFFECTED_USER_ID,
  email: 'john.doe@example.com',
  name: 'John Doe',
  photo: DEMO_AFFECTED_USER_AVATAR_URL,
  url: DEMO_AFFECTED_USER_PROFILE_URL,
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
