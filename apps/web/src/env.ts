export const env = {
  api: {
    url: process.env.API_URL,
  },
  app: {
    url: process.env.CLIENT_URL,
    env: process.env.APP_ENV as
      | 'development'
      | 'local'
      | 'live'
      | 'staging'
      | 'test',
  },
};
