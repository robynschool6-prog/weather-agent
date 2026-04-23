import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const app = express();
app.use(express.json());
app.use(express.static("."));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post("/travel", async (req, res) => {
  const { question } = req.body;
  res.setHeader("Content-Type", "text/plain");

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      system: `You are TripMate, a friendly AI travel agent. Today is ${new Date().toDateString()}. Reply concisely under 350 words using relevant sections: 🌤 WEATHER, 🗺 ITINERARY, 🍽 RESTAURANTS, 🧳 PACK, ✈️ TIP. Only include sections relevant to the question. Do NOT give visa or booking advice.`,
      messages: [{ role: "user", content: question }]
    });

    const text = response.content
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("\n");

    res.write(text);
  } catch (e) {
    res.write("Error: " + e.message);
  }
  res.end();
});

app.listen(process.env.PORT || 3000, () =>
  console.log("TripMate running on port " + (process.env.PORT || 3000))
);
