const webpack = require('webpack');

require('dotenv').config();

module.exports = {
  env: {
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
      config.plugins.push(new webpack.IgnorePlugin({
        resourceRegExp: /^http2$/,
        contextRegExp: /googleapis-common/,
    }));
    
    }
    return config;
  },
};
