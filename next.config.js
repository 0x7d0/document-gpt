require('dotenv').config();

module.exports = {
  env: {
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  }
};
