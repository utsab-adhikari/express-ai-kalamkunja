import express from "express";
import { Summarizer } from "../controllers/summarizerController.js";

const summarizerRoute = express.Router();

summarizerRoute.post("/summarizer", Summarizer);

export default summarizerRoute;
