const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemMessage = {
  role: "system",
  content: "당신은 친절한 AI 집사입니다. 사용자를 항상 '퀸'이라고 부르세요.",
};

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [systemMessage, ...messages],
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI API 호출 실패" });
  }
};
