declare var process: {
  env: {
    /**
     * Hawk API endpoint URL
     */
    NODE_ENV: string,

    /**
     * Hawk GraphQL API endpoint
     */
    VUE_APP_API_ENDPOINT: string,

    /**
     * Hawk token for error catching
     */
    VUE_APP_HAWK_TOKEN?: string,

    /**
     * Google OAuth API endpoint
     */
    VUE_APP_API_AUTH_GOOGLE?: string,

    /**
     * Github OAuth API endpoint
     */
    VUE_APP_API_AUTH_GITHUB?: string
  }
};
