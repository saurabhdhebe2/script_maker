require('dotenv').config();
const axios = require('axios');

const generateScriptFromOpenAI = async (topic, length, category='short', time='1 min') => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a professional YouTube scriptwriter.' },
        { role: 'user', content: `Generate a YouTube script on: "${topic}". Length: approx ${length} tokens.` }
      ],
      max_tokens: length,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response?.data?.choices?.[0]?.message?.content?.trim() ?? null;
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null
  }
};

module.exports = { generateScriptFromOpenAI };
