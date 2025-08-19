import express from "express";
import { scrapeAndAI } from "../controllers/scrapAndAi.js";

const scraperRoute = express.Router();

scraperRoute.post("/scraper", scrapeAndAI);

export default scraperRoute;