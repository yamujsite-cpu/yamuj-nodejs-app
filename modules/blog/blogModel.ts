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
  },
  { timestamps: true },
);

const BlogModel = mongoose.model("Blog", blogSchema);

export default BlogModel;
