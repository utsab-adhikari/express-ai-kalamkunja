import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    headline: String,
    slug: String,
    image: String,
    link: { type: String, unique: true },
    source: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const News = mongoose.models.News || mongoose.model("News", NewsSchema);
export default News;
