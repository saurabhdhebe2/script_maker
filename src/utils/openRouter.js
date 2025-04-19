require('dotenv').config();
const axios = require('axios');

const generateScriptFromOpenRouter = async (topic, length, category = 'short', time = '1 min', keywords = []) => {
  try {
    const prompt = [
      `Generate a ${category} YouTube script.`,
      `Topic: "${topic}".`,
      `Estimated duration: ${time}.`,
      `Target length: approx ${length} tokens.`,
      keywords.length ? `Focus on keywords: ${keywords.join(', ')}.` : null,
      `The script should be engaging and structured for YouTube.`,
    ].filter(Boolean).join(' ');

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mixtral-8x7b-instruct',
        messages: [
          { role: 'system', content: 'You are a professional YouTube scriptwriter.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: length,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://yourdomain.com',
          'Content-Type': 'application/json'
        }
      }
    );

    return response?.data?.choices?.[0]?.message?.content?.trim() ?? null;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
};

module.exports = { generateScriptFromOpenRouter };
