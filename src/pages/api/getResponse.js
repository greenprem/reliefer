// pages/api/getResponse.js
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: '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' });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { messages } = req.body;

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: "llama3-8b-8192",
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null
      });

      res.status(200).json(chatCompletion.choices[0].message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
