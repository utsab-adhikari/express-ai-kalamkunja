import express from "express";
import { Studio } from "../controllers/studioController.js";

const studioRoute = express.Router();

studioRoute.post("/studio", Studio);

export default studioRoute;
