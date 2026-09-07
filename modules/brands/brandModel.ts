import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema(
  {
    sortOrder: { type: Number, default: 0 },
    logos: [{ type: String }],
    title: {
      en: { type: String, default: "" },
      ar: { type: String, default: "" },
    },
    description: {
      en: { type: String, default: "" },
      ar: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  },
);

const BrandModel = mongoose.model("Brand", brandSchema);

export default BrandModel;
