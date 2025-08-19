import axios from "axios";
import * as cheerio from "cheerio";
import OpenAI from "openai";
import dotenv from "dotenv";
import scraperInstruction from "../db/scraperInstruction.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const scrapeAndAI = async (req, res) => {
  try {
    const { url, options } = req.body;
    if (!url)
      return res.status(400).json({ success: false, message: "URL is required" });

    const { data: html } = await axios.get(url, {
      headers: { "User-Agent": "DataKunjaBot/1.0" },
    });

    const $ = cheerio.load(html);
    const textContent = $("body").text().replace(/\s+/g, " ").trim();

    const prompt = `${scraperInstruction}\n\nPage Text:\n${textContent.slice(
      0,
      4000
    )}\n\nOptions: ${JSON.stringify(options)}`;

    const aiRes = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a smart content extractor AI." },
        { role: "user", content: prompt },
      ],
    });

    let structuredData;
    try {
      structuredData = JSON.parse(aiRes.choices[0].message.content);
    } catch {
      structuredData = { main_content: textContent, articles: [] };
    }

    return res.status(200).json({ success: true, data: structuredData });
  } catch (err) {
    console.error("Scraper/AI Error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Failed to scrape and process the webpage",
    });
  }
};
