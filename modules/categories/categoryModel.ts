import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, default: "" },
      ar: { type: String, default: "" },
    },
    slug: { type: String, lowercase: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  },
);

categorySchema.virtual("projectsCount", {
  ref: "Project",
  localField: "_id",
  foreignField: "category",
  count: true,
});

const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;
