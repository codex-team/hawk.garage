/**
 * Mixin computes project badges
 */
export const projectBadges = {
  methods: {
    /**
     * Returns parsed badges from project name
     * @param name - full project name
     */
    projectBadges(name: string): string[] | null {
      const badgeRegex = /\[(.*?)]/gm;

      const badges = name.match(badgeRegex);

      return badges ? badges.map(badge => badge.slice(1, -1)) : null;
    },

    /**
     * Returns project name without badges
     * @param name - full project name
     */
    nameWithoutBadges(name: string): string {
      const badgeRegex = / ?\[(.*?)]/gm;

      return name.replace(badgeRegex, '');
    },
  },
};
