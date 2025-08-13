import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import studioRoute from "./routes/studioRoutes.js";
import rateLimit from "express-rate-limit";

const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: (req, res) => {
    const user = req.body.user;

    if (!user || user === "undefined") return 1; // guest
    if (user.role === "admin") return 5000; // admin
    if (user.isVerified) return 5; // verified
    return 2; // not verified
  },
  handler: (req, res) => {
    const user = req.body.user;

    if (!user || user === "undefined") {
      return res.status(429).json({
        status: 429,
        message: "Sign In required for more ",
      });
    }
    if (!user.isVerified) {
      return res.status(429).json({
        status: 429,
        message: "Verify account to increase limit",
      });
    }
    return res.status(429).json({
      status: 429,
      message: "Too many requests",
    });
  },
});

dotenv.config();

const PORT = process.env.PORT || 5050;

const app = express();

const allowedOrigins = [
  "https://kalamkunja.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello sir ji");
});

app.use("/v1/ai", aiLimiter, studioRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
