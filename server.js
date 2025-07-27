// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { CohereClient } = require("cohere-ai");

const app = express();
app.use(cors());
app.use(express.json());

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

app.post("/api/scene", async (req, res) => {
  const { characters } = req.body;

  if (!characters || characters.length < 2) {
    return res.status(400).json({ error: "Select at least 2 characters." });
  }

  const prompt = `
Write a sitcom-style scene featuring these characters: ${characters.join(", ")}.
- Each character should speak in their usual tone.
- Include misunderstandings, punchlines, and funny moments.
- Format it as a screenplay/dialogue.
- Limit to 6–10 exchanges.
`;

  try {
    const response = await cohere.generate({
      model: "command-r-plus",
      prompt,
      maxTokens: 500,
      temperature: 0.9,
    });

    const scene = response.generations[0]?.text || "No scene generated.";
    res.json({ scene });
  } catch (err) {
    console.error("Error from Cohere:", err);
    res.status(500).json({ error: "Failed to generate scene." });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
