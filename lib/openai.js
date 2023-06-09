const axios = require("axios");

async function analyzeDocument(prompt) {
  const response = await axios.post(
    "https://api.openai.com/v1/engines/davinci-codex/completions",
    {
      prompt,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.7,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  return response.data.choices[0].text.trim();
}

module.exports = { analyzeDocument };
