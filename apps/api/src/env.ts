export const env = {
  api: {
    port: process.env.API_PORT || 5555,
    url: process.env.API_URL,
  },
  app: {
    url: process.env.CLIENT_URL,
    env: process.env.APP_ENV as
      | 'development'
      | 'live'
      | 'staging'
      | 'test'
      | 'local',
  },
};
