require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    const systemMessage = {
      role: "system",
      content: "당신은 친절한 AI 챗봇입니다. 사용자를 항상 '퀸'이라고 부르세요.",
    };

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [systemMessage, ...messages],
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI API 호출 실패" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
