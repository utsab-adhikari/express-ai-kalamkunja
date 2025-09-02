import mongoose from "mongoose";

const aiArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const AiArticle = mongoose.model("AiArticle", aiArticleSchema);

export default AiArticle;
