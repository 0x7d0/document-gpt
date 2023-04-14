module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Remove the `fs` property from the `node` configuration
    delete config.node.fs;

    return config;
  },
  env: {
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};
