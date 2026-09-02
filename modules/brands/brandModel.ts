import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema(
  {
    sortOrder: { type: Number, default: 0 },
    title: {
      en: { type: String, default: "" },
      ar: { type: String, default: "" },
    },
    slug: { type: String, lowercase: true },
    logos: [{ type: String }],
  },
  {
    timestamps: true,
  },
);

const BrandModel = mongoose.model("Brand", brandSchema);

export default BrandModel;
