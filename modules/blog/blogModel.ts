import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    video: {
      type: String,
    },
    showInHome: {
      type: Boolean,
      default: false,
    },
    title: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
  },
  { timestamps: true },
);

const BlogModel = mongoose.model("Blog", blogSchema);

export default BlogModel;
