import OpenAI from "openai";
import assistantProfile from "../db/chatbotinstruction.js";
import dotenv from "dotenv";
import AiArticle from "../models/aiArticleModel.js";
import connectDB from "../db/ConnectDB.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const Studio = async (req, res) => {
  await connectDB();
  try {
    const body = await req.body;
    const userMessage = body.message;
    if (!userMessage) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: assistantProfile },
        { role: "user", content: userMessage },
      ],
    });

    const aiMessage = chatCompletion.choices[0].message.content;

    {body.user && body.user !== "undefined" && await AiArticle.create({
      title: userMessage,
      content: aiMessage,
      author: body.user.id,
    })}

    return res.status(200).json({
      from: "ai",
      message: aiMessage.trim(),
    });
  } catch (error) {
    console.error("OpenAI Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
