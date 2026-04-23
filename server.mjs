import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(express.json());
app.use(express.static('.'));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post('/travel', async (req, res) => {
  const { question } = req.body;
  res.setHeader('Content-Type', 'text/plain');
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: 'You are TripMate, a friendly AI travel agent. Reply under 350 words using sections: WEATHER, ITINERARY, RESTAURANTS, PACK, TIP. Do not give visa or booking advice.',
      messages: [{ role: 'user', content: question }]
    });
    const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
    res.write(text);
  } catch (e) {
    res.write('Error: ' + e.message);
  }
  res.end();
});

const PORT = parseInt(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => console.log('TripMate running on port ' + PORT));
