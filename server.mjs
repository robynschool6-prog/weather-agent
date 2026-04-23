import express from "express";
import { query } from "@anthropic-ai/claude-agent-sdk";

const app = express();
app.use(express.json());
app.use(express.static("."));

app.post("/travel", async (req, res) => {
  const { question } = req.body;
  res.setHeader("Content-Type", "text/plain");

  const prompt = `You are TripMate, a friendly AI travel agent. Today is ${new Date().toDateString()}.

User asks: ${question}

Reply concisely in under 250 words. Use WebSearch to find current info. Format with relevant sections only:

🌤 WEATHER - current conditions and forecast
🗺 ITINERARY - day by day plan
🍽 RESTAURANTS - 3 local recommendations  
🧳 PACK - 4 bullet points
✈️ TIP - one practical tip

Do NOT give visa or booking advice.`;

  try {
    for await (const msg of query({ prompt, options: { allowedTools: ["WebSearch"], permissionMode: "acceptEdits", maxTurns: 5 } })) {
      if (msg.result) res.write(msg.result);
    }
  } catch (e) {
    res.write("Error: " + e.message);
  }
  res.end();
});

app.listen(3000, () => console.log("TripMate running at http://localhost:3000"));
