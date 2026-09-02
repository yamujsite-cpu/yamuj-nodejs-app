import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String },
      ar: { type: String },
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      en: { type: String },
      ar: { type: String },
    },
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
  },
  { timestamps: true },
);

const BlogModel = mongoose.model("Blog", blogSchema);

export default BlogModel;
