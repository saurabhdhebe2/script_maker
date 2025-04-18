require('dotenv').config();
const axios = require('axios');

const generateScriptFromOpenRouter = async (topic, length) => {
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'mistralai/mixtral-8x7b-instruct', // Or use 'anthropic/claude-3-haiku'
      messages: [
        { role: 'system', content: 'You are a professional YouTube scriptwriter.' },
        { role: 'user', content: `Generate a YouTube script on: "${topic}". Length: approx ${length} tokens.` }
      ],
      max_tokens: length,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://yourdomain.com', // set your actual domain if hosting
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error('Error with OpenRouter API');
  }
};

module.exports = { generateScriptFromOpenRouter };
